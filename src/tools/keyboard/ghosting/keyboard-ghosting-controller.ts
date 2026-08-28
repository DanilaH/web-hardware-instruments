import {
  createKeyboardInputService,
  type KeyboardInputServiceEvent,
} from '../../../browser/keyboard-input-service';
import {
  clearGhostingHeld,
  createKeyboardGhostingObservationState,
  getKeyboardGhostingObservationResult,
  observeGhostingKeyDown,
  observeGhostingKeyUp,
  type KeyboardGhostingObservationState,
} from './ghosting-state';
import {
  formatKeyboardCode,
  getKeyboardGhostingPreset,
  type KeyboardGhostingPreset,
} from './ghosting-presets';

export interface KeyboardGhostingController {
  start(): void;
  stop(): void;
  destroy(): void;
}

type GhostingPhase = 'idle' | 'prep' | 'observing' | 'complete' | 'interrupted';

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Keyboard Ghosting Test is missing ${selector}`);
  return element;
};

export const mountKeyboardGhostingTest = (root: HTMLElement): KeyboardGhostingController => {
  const status = requireElement<HTMLElement>(root, '[data-ghosting-status]');
  const presetSelect = requireElement<HTMLSelectElement>(root, '[data-ghosting-preset]');
  const startButton = requireElement<HTMLButtonElement>(root, '[data-ghosting-start]');
  const result = requireElement<HTMLElement>(root, '[data-ghosting-result]');
  const detail = requireElement<HTMLElement>(root, '[data-ghosting-detail]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-ghosting-accessible-summary]');
  const keyElements = [...root.querySelectorAll<HTMLElement>('[data-key-code]')];
  const keyElementsByCode = new Map<string, HTMLElement>();

  keyElements.forEach((element) => {
    const code = element.dataset.keyCode;
    if (code) keyElementsByCode.set(code, element);
  });

  const service = createKeyboardInputService();
  const heldCodes = new Set<string>();
  let phase: GhostingPhase = 'idle';
  let selectedPreset: KeyboardGhostingPreset = getKeyboardGhostingPreset(presetSelect.value);
  let observation: KeyboardGhostingObservationState | null = null;
  let prepTimer: number | null = null;
  let observationTimer: number | null = null;
  let destroyed = false;

  const clearTimers = (): void => {
    if (prepTimer !== null) window.clearTimeout(prepTimer);
    if (observationTimer !== null) window.clearTimeout(observationTimer);
    prepTimer = null;
    observationTimer = null;
  };

  const setPressedVisual = (code: string, pressed: boolean): void => {
    const element = keyElementsByCode.get(code);
    if (element) element.dataset.pressed = pressed ? 'true' : 'false';
  };

  const clearPressedVisuals = (): void => {
    heldCodes.forEach((code) => setPressedVisual(code, false));
  };

  const renderExpectedKeys = (): void => {
    keyElements.forEach((element) => {
      const code = element.dataset.keyCode ?? '';
      element.dataset.expected = selectedPreset.codes.includes(code) ? 'true' : 'false';
      element.dataset.observation = 'none';
      element.dataset.additional = 'false';
    });
  };

  const renderCompletedSnapshot = (): void => {
    if (!observation) return;
    const observationResult = getKeyboardGhostingObservationResult(observation);
    const matchedCodes = observation.bestMatchedCodes;
    const additionalCodes = new Set(observationResult.additionalDetectedCodes);

    keyElements.forEach((element) => {
      const code = element.dataset.keyCode ?? '';
      if (selectedPreset.codes.includes(code)) {
        element.dataset.observation = matchedCodes.has(code) ? 'matched' : 'missed';
      } else {
        element.dataset.observation = 'none';
      }
      element.dataset.additional = additionalCodes.has(code) ? 'true' : 'false';
    });
  };

  const setControlsForRunning = (running: boolean): void => {
    presetSelect.disabled = running;
    startButton.disabled = running;
  };

  const interruptRun = (message: string): void => {
    if (phase !== 'prep' && phase !== 'observing') return;
    clearTimers();
    if (observation) observation = clearGhostingHeld(observation);
    phase = 'interrupted';
    root.dataset.phase = phase;
    status.textContent = 'Observation interrupted';
    result.textContent = message;
    detail.textContent = 'Start a new test when the page is visible and focused.';
    accessibleSummary.textContent = `${message} Start a new test.`;
    setControlsForRunning(false);
  };

  const completeObservation = (): void => {
    if (phase !== 'observing' || !observation) return;
    observationTimer = null;
    phase = 'complete';
    root.dataset.phase = phase;
    status.textContent = 'Observation complete';
    setControlsForRunning(false);

    const observationResult = getKeyboardGhostingObservationResult(observation);
    const allDetected = observationResult.matchedCount === observationResult.expectedCount;
    result.textContent = allDetected
      ? `All ${observationResult.expectedCount} selected keys were detected together.`
      : `${observationResult.matchedCount} of ${observationResult.expectedCount} selected keys were detected together at best.`;

    const detailParts: string[] = [];
    if (observationResult.missingCodes.length > 0) {
      detailParts.push(
        `Not observed together: ${observationResult.missingCodes.map(formatKeyboardCode).join(', ')}.`,
      );
    }

    const [onlyAdditionalCode] = observationResult.additionalDetectedCodes;
    if (observationResult.additionalDetectedCodes.length === 1 && onlyAdditionalCode) {
      detailParts.push(`Additional detected key: ${formatKeyboardCode(onlyAdditionalCode)}.`);
    } else if (observationResult.additionalDetectedCodes.length > 1) {
      detailParts.push(
        `Additional detected keys: ${observationResult.additionalDetectedCodes.map(formatKeyboardCode).join(', ')}.`,
      );
    }
    detail.textContent = detailParts.join(' ');
    accessibleSummary.textContent = [result.textContent, detail.textContent].filter(Boolean).join(' ');
    renderCompletedSnapshot();
  };

  const beginObservation = (): void => {
    if (phase !== 'prep') return;
    prepTimer = null;
    phase = 'observing';
    root.dataset.phase = phase;
    observation = createKeyboardGhostingObservationState(selectedPreset.codes, [...heldCodes]);
    status.textContent = 'Hold every highlighted key — observing for 3 seconds';
    result.textContent = 'Observing this combination…';
    detail.textContent = '';
    observationTimer = window.setTimeout(completeObservation, 3_000);
  };

  const handleStart = (): void => {
    if (phase === 'prep' || phase === 'observing' || destroyed) return;
    clearTimers();
    selectedPreset = getKeyboardGhostingPreset(presetSelect.value);
    observation = null;
    phase = 'prep';
    root.dataset.phase = phase;
    renderExpectedKeys();
    setControlsForRunning(true);
    status.textContent = 'Get ready…';
    result.textContent = 'Get ready…';
    detail.textContent = 'Hold every highlighted key when the observation begins.';
    accessibleSummary.textContent = 'Get ready. Hold every highlighted key when the three-second observation begins.';
    prepTimer = window.setTimeout(beginObservation, 1_000);
  };

  const handlePresetChange = (): void => {
    if (phase === 'prep' || phase === 'observing') return;
    selectedPreset = getKeyboardGhostingPreset(presetSelect.value);
    phase = 'idle';
    root.dataset.phase = phase;
    observation = null;
    result.textContent = 'Choose a combination, then start the guided observation.';
    detail.textContent = '';
    status.textContent = 'Ready for a guided combination';
    renderExpectedKeys();
  };

  const handleEvent = (event: KeyboardInputServiceEvent): void => {
    if (destroyed) return;

    if (event.type === 'clear') {
      clearPressedVisuals();
      heldCodes.clear();
      if (observation) observation = clearGhostingHeld(observation);
      if (phase === 'prep' || phase === 'observing') {
        interruptRun('Test interrupted — keep this page visible and start again.');
      }
      return;
    }

    if (event.type === 'keyup') {
      if (!event.code) return;
      heldCodes.delete(event.code);
      setPressedVisual(event.code, false);
      if (phase === 'observing' && observation) {
        observation = observeGhostingKeyUp(observation, event.code);
      }
      return;
    }

    if (!event.code) return;
    heldCodes.add(event.code);
    setPressedVisual(event.code, true);
    if (phase === 'observing' && observation) {
      observation = observeGhostingKeyDown(observation, event.code);
    }
  };

  startButton.addEventListener('click', handleStart);
  presetSelect.addEventListener('change', handlePresetChange);
  renderExpectedKeys();

  const unsubscribe = service.subscribe(handleEvent);
  const started = service.start();
  if (!started) {
    root.dataset.state = 'unavailable';
    status.textContent = 'Keyboard input unavailable';
    result.textContent = 'This browser context could not attach keyboard input listeners.';
    startButton.disabled = true;
    presetSelect.disabled = true;
    accessibleSummary.textContent = 'Keyboard input is unavailable in this browser context.';
  }

  return {
    start: () => {
      if (destroyed) return;
      if (service.start()) {
        root.dataset.state = 'ready';
        if (phase === 'interrupted') {
          status.textContent = 'Ready to start again';
        }
        if (phase !== 'prep' && phase !== 'observing') setControlsForRunning(false);
      }
    },
    stop: () => {
      if (destroyed) return;
      interruptRun('Test interrupted — keep this page visible and start again.');
      clearPressedVisuals();
      heldCodes.clear();
      if (observation) observation = clearGhostingHeld(observation);
      service.stop();
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      clearTimers();
      clearPressedVisuals();
      heldCodes.clear();
      startButton.removeEventListener('click', handleStart);
      presetSelect.removeEventListener('change', handlePresetChange);
      unsubscribe();
      service.destroy();
    },
  };
};
