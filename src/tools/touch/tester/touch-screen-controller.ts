import { createFullscreenHelper } from '../../../browser/fullscreen';
import {
  createTouchInputService,
  type TouchInputEvent,
  type TouchPointInputEvent,
} from '../../../browser/touch-input-service';
import { renderTouchOverlay } from '../../../visuals/touch/touch-overlay-renderer';
import {
  armHandsOffCheck,
  beginHandsOffCheck,
  completeHandsOffCheck,
  createHandsOffState,
  interruptHandsOffCheck,
  observeHandsOffContactStart,
  observeHandsOffContactsEmpty,
  type HandsOffState,
} from './hands-off-check';
import {
  clearActiveContacts,
  coveragePercentage,
  createTouchTestState,
  observeTouchSample,
  repeatableMissedCellCount,
  startTouchConfirmation,
  touchGridCellCount,
  type TouchTestState,
} from './touch-test-state';

export interface TouchScreenController {
  start(): void;
  stop(): void;
  destroy(): void;
}

interface VisualContact {
  x: number;
  y: number;
  trail: { x: number; y: number }[];
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Touch Screen Test is missing ${selector}`);
  return element;
};

const isRunningHandsOff = (state: HandsOffState): boolean =>
  state.phase === 'waiting-for-empty' || state.phase === 'guarding' || state.phase === 'armed';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const mountTouchScreenTest = (root: HTMLElement): TouchScreenController => {
  const surface = requireElement<HTMLElement>(root, '[data-touch-surface]');
  const overlay = requireElement<SVGSVGElement>(root, '[data-touch-overlay]');
  const status = requireElement<HTMLElement>(root, '[data-touch-status]');
  const activeValue = requireElement<HTMLElement>(root, '[data-touch-active]');
  const maximumValue = requireElement<HTMLElement>(root, '[data-touch-maximum]');
  const coverageValue = requireElement<HTMLElement>(root, '[data-touch-coverage]');
  const confirmationButton = requireElement<HTMLButtonElement>(root, '[data-touch-confirmation]');
  const confirmationSummary = requireElement<HTMLElement>(root, '[data-touch-confirmation-summary]');
  const resetButton = requireElement<HTMLButtonElement>(root, '[data-touch-reset]');
  const fullscreenButton = requireElement<HTMLButtonElement>(root, '[data-touch-fullscreen]');
  const fullscreenNote = requireElement<HTMLElement>(root, '[data-touch-fullscreen-note]');
  const handsOffButton = requireElement<HTMLButtonElement>(root, '[data-touch-hands-off]');
  const handsOffResult = requireElement<HTMLElement>(root, '[data-touch-hands-off-result]');
  const reportedMaximum = requireElement<HTMLElement>(root, '[data-touch-reported-maximum]');
  const cells = [...root.querySelectorAll<HTMLElement>('[data-touch-cell]')];

  const service = createTouchInputService(surface);
  const fullscreen = createFullscreenHelper();
  const reportedMaxTouchPoints = service.getReportedMaxTouchPoints();
  const touchCapabilityReported = reportedMaxTouchPoints > 0;
  let state: TouchTestState = createTouchTestState();
  let handsOff = createHandsOffState();
  const globalActiveContacts = new Set<number>();
  const visualContacts = new Map<number, VisualContact>();
  let acquisitionAvailable = false;
  let touchObserved = false;
  let destroyed = false;
  let guardTimer: number | null = null;
  let observationTimer: number | null = null;
  let visualFrame: number | null = null;
  let uiFrame: number | null = null;

  const isTouchUsable = (): boolean =>
    acquisitionAvailable && (touchCapabilityReported || touchObserved);

  const clearTimers = (): void => {
    if (guardTimer !== null) window.clearTimeout(guardTimer);
    if (observationTimer !== null) window.clearTimeout(observationTimer);
    guardTimer = null;
    observationTimer = null;
  };

  const scheduleOverlayRender = (): void => {
    if (visualFrame !== null) return;
    visualFrame = window.requestAnimationFrame(() => {
      visualFrame = null;
      renderTouchOverlay(overlay, {
        contacts: [...visualContacts.values()],
        unexpectedStarts: handsOff.phase === 'complete' ? handsOff.markers : [],
      });
    });
  };

  const renderCoverage = (): void => {
    cells.forEach((cell, index) => {
      if (state.mode === 'coverage') {
        cell.dataset.coverage = state.pass1Covered.has(index) ? 'covered' : 'open';
        return;
      }

      if (state.pass2Covered.has(index)) {
        cell.dataset.coverage = 'confirmed';
      } else if (state.pass1Covered.has(index)) {
        cell.dataset.coverage = 'pass1';
      } else {
        cell.dataset.coverage = 'target';
      }
    });
  };

  const render = (): void => {
    const handsOffRunning = isRunningHandsOff(handsOff);
    const touchUsable = isTouchUsable();
    activeValue.textContent = String(state.activeContacts.size);
    maximumValue.textContent = String(state.maximumDetectedTogether);
    coverageValue.textContent = `${Math.round(coveragePercentage(state))}%`;

    if (!acquisitionAvailable) {
      root.dataset.state = 'unavailable';
      status.textContent = 'Touch input is unavailable in this browser.';
    } else if (!touchUsable) {
      root.dataset.state = 'unavailable';
      status.textContent = 'No touchscreen capability is reported on this device. Open this page on the device you want to test.';
    } else {
      root.dataset.state = state.mode === 'confirmation' ? 'confirmation' : 'ready';
      status.textContent = state.mode === 'confirmation'
        ? 'Confirmation pass — sweep the emphasized missed cells again.'
        : 'Touch input ready';
    }

    confirmationButton.hidden = state.mode === 'confirmation' || state.pass1Covered.size === touchGridCellCount;
    confirmationButton.disabled = !touchUsable || handsOffRunning;
    confirmationSummary.hidden = state.mode !== 'confirmation';
    if (state.mode === 'confirmation') {
      confirmationSummary.textContent = `Still not observed in either pass: ${repeatableMissedCellCount(state)} cells. Keep sweeping the emphasized cells; repeatable missed areas may indicate a touch problem, but this browser test cannot identify the failed hardware component.`;
    }

    resetButton.disabled = !touchUsable;
    fullscreenButton.disabled = !touchUsable || handsOffRunning;
    handsOffButton.disabled = !touchUsable || handsOffRunning;
    renderCoverage();
    scheduleOverlayRender();
  };

  const scheduleRender = (): void => {
    if (uiFrame !== null) return;
    uiFrame = window.requestAnimationFrame(() => {
      uiFrame = null;
      render();
    });
  };

  const updateVisualContact = (event: TouchPointInputEvent): void => {
    if (!Number.isFinite(event.x) || !Number.isFinite(event.y)) return;
    const x = clamp01(event.x);
    const y = clamp01(event.y);
    const existing = visualContacts.get(event.pointerId);
    const trail = [...(existing?.trail ?? []), { x, y }].slice(-8);
    visualContacts.set(event.pointerId, { x, y, trail });
    scheduleOverlayRender();
  };

  const interruptHandsOff = (): void => {
    if (!isRunningHandsOff(handsOff)) return;
    clearTimers();
    handsOff = interruptHandsOffCheck(handsOff);
    handsOffResult.textContent = 'Check interrupted — keep this page visible and start again.';
    scheduleOverlayRender();
  };

  const beginGuard = (): void => {
    if (handsOff.phase !== 'guarding') return;
    if (guardTimer !== null) window.clearTimeout(guardTimer);
    handsOffResult.textContent = 'Waiting for 500 ms with no touch input…';
    guardTimer = window.setTimeout(() => {
      guardTimer = null;
      if (handsOff.phase !== 'guarding' || globalActiveContacts.size !== 0) return;
      handsOff = armHandsOffCheck(handsOff);
      handsOffResult.textContent = 'Place the device down and do not touch the screen. Observing for 15 seconds…';
      observationTimer = window.setTimeout(() => {
        observationTimer = null;
        if (handsOff.phase !== 'armed') return;
        handsOff = completeHandsOffCheck(handsOff);
        handsOffResult.textContent = handsOff.unexpectedStarts === 0
          ? 'No unexpected touch input observed in 15 seconds'
          : `Unexpected touch input observed: ${handsOff.unexpectedStarts} contacts`;
        render();
      }, 15_000);
    }, 500);
  };

  const updateGlobalContactLifecycle = (event: TouchPointInputEvent): void => {
    if (event.type === 'start') {
      globalActiveContacts.add(event.pointerId);
    } else if (event.type === 'end' || event.type === 'cancel') {
      globalActiveContacts.delete(event.pointerId);
    }
  };

  const handleTouchEvent = (event: TouchInputEvent): void => {
    if (destroyed) return;

    if (event.type === 'clear') {
      globalActiveContacts.clear();
      state = clearActiveContacts(state);
      visualContacts.clear();
      interruptHandsOff();
      render();
      return;
    }

    const firstObservedTouch = !touchObserved;
    touchObserved = true;
    updateGlobalContactLifecycle(event);
    const handsOffWasRunning = isRunningHandsOff(handsOff);
    const previousState = state;

    if (!handsOffWasRunning) {
      state = observeTouchSample(state, {
        phase: event.type,
        contactId: event.pointerId,
        x: event.x,
        y: event.y,
        insideSurface: event.insideSurface,
      });

      if (event.type === 'start') {
        if (event.insideSurface) updateVisualContact(event);
      } else if (event.type === 'move') {
        if (event.insideSurface || visualContacts.has(event.pointerId)) updateVisualContact(event);
      } else {
        visualContacts.delete(event.pointerId);
        scheduleOverlayRender();
      }
    }

    if (event.type === 'start') {
      const marker = event.insideSurface && Number.isFinite(event.x) && Number.isFinite(event.y)
        ? { x: clamp01(event.x), y: clamp01(event.y) }
        : null;
      const previousHandsOff = handsOff;
      handsOff = observeHandsOffContactStart(handsOff, marker);
      if (previousHandsOff.phase === 'guarding' && handsOff.phase === 'waiting-for-empty') {
        if (guardTimer !== null) window.clearTimeout(guardTimer);
        guardTimer = null;
        handsOffResult.textContent = 'Lift all fingers to restart the quiet guard.';
      } else if (previousHandsOff.phase === 'armed' && handsOff.phase === 'armed') {
        handsOffResult.textContent = `Place the device down and do not touch the screen. Unexpected contacts so far: ${handsOff.unexpectedStarts}.`;
      }
    }

    if ((event.type === 'end' || event.type === 'cancel') && globalActiveContacts.size === 0) {
      const previousHandsOff = handsOff;
      handsOff = observeHandsOffContactsEmpty(handsOff);
      if (previousHandsOff.phase === 'waiting-for-empty' && handsOff.phase === 'guarding') {
        beginGuard();
      }
    }

    if (firstObservedTouch || state !== previousState) scheduleRender();
  };

  const unsubscribeTouch = service.subscribe(handleTouchEvent);
  const unsubscribeFullscreen = fullscreen.subscribe(() => {
    const active = fullscreen.getActiveElement() === root;
    root.dataset.fullscreen = active ? 'true' : 'false';
    fullscreenButton.textContent = active ? 'Exit full screen' : 'Full screen';
    fullscreenNote.textContent = active ? 'Full screen active.' : '';
  });

  const handleConfirmation = (): void => {
    if (!isTouchUsable() || state.mode === 'confirmation' || isRunningHandsOff(handsOff)) return;
    state = startTouchConfirmation(state);
    visualContacts.clear();
    render();
  };

  const handleReset = (): void => {
    if (!isTouchUsable()) return;
    interruptHandsOff();
    handsOff = createHandsOffState();
    handsOffResult.textContent = 'Optional: run a separate 15-second hands-off observation.';
    state = createTouchTestState();
    visualContacts.clear();
    render();
  };

  const handleHandsOffStart = (): void => {
    if (!isTouchUsable() || isRunningHandsOff(handsOff)) return;
    clearTimers();
    state = clearActiveContacts(state);
    visualContacts.clear();
    handsOff = beginHandsOffCheck(globalActiveContacts.size);
    if (handsOff.phase === 'guarding') {
      beginGuard();
    } else {
      handsOffResult.textContent = 'Lift all fingers to begin the quiet guard.';
    }
    render();
  };

  const handleFullscreen = async (): Promise<void> => {
    if (!fullscreen.isSupported() || !isTouchUsable() || isRunningHandsOff(handsOff)) return;
    const success = fullscreen.getActiveElement() === root
      ? await fullscreen.exit()
      : await fullscreen.request(root);
    if (!success) fullscreenNote.textContent = 'Full screen unavailable — continue in-page.';
  };

  confirmationButton.addEventListener('click', handleConfirmation);
  resetButton.addEventListener('click', handleReset);
  handsOffButton.addEventListener('click', handleHandsOffStart);
  fullscreenButton.addEventListener('click', handleFullscreen);

  reportedMaximum.textContent = String(reportedMaxTouchPoints);
  fullscreenButton.hidden = !fullscreen.isSupported();
  acquisitionAvailable = service.start();
  render();

  return {
    start: () => {
      if (destroyed) return;
      acquisitionAvailable = service.start();
      render();
    },
    stop: () => {
      if (destroyed) return;
      interruptHandsOff();
      service.stop();
      globalActiveContacts.clear();
      state = clearActiveContacts(state);
      visualContacts.clear();
      render();
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      clearTimers();
      if (visualFrame !== null) window.cancelAnimationFrame(visualFrame);
      if (uiFrame !== null) window.cancelAnimationFrame(uiFrame);
      visualFrame = null;
      uiFrame = null;
      confirmationButton.removeEventListener('click', handleConfirmation);
      resetButton.removeEventListener('click', handleReset);
      handsOffButton.removeEventListener('click', handleHandsOffStart);
      fullscreenButton.removeEventListener('click', handleFullscreen);
      unsubscribeTouch();
      unsubscribeFullscreen();
      service.destroy();
      fullscreen.destroy();
    },
  };
};
