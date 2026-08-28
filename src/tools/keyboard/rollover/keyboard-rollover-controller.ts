import {
  createKeyboardInputService,
  type KeyboardInputServiceEvent,
} from '../../../browser/keyboard-input-service';
import {
  clearRolloverHeld,
  createKeyboardRolloverState,
  observeRolloverKeyDown,
  observeRolloverKeyUp,
  resetRolloverMaximum,
  type KeyboardRolloverState,
} from './rollover-state';

export interface KeyboardRolloverController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Keyboard Rollover Test is missing ${selector}`);
  return element;
};

const formatKey = (key: string, code: string): string => {
  if (key === ' ') return 'Space';
  if (key && key !== 'Unidentified') return key;
  return code || 'Unidentified';
};

export const mountKeyboardRolloverTest = (root: HTMLElement): KeyboardRolloverController => {
  const status = requireElement<HTMLElement>(root, '[data-rollover-status]');
  const heldValue = requireElement<HTMLElement>(root, '[data-rollover-held]');
  const maximumValue = requireElement<HTMLElement>(root, '[data-rollover-maximum]');
  const lastValue = requireElement<HTMLElement>(root, '[data-rollover-last]');
  const resetButton = requireElement<HTMLButtonElement>(root, '[data-rollover-reset]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-rollover-accessible-summary]');
  const keyElements = [...root.querySelectorAll<HTMLElement>('[data-key-code]')];
  const keyElementsByCode = new Map<string, HTMLElement>();

  keyElements.forEach((element) => {
    const code = element.dataset.keyCode;
    if (code) keyElementsByCode.set(code, element);
  });

  const service = createKeyboardInputService();
  let state: KeyboardRolloverState = createKeyboardRolloverState();
  let lastDetectedLabel = '—';
  let destroyed = false;

  const setPressedVisual = (code: string, pressed: boolean): void => {
    const element = keyElementsByCode.get(code);
    if (element) element.dataset.pressed = pressed ? 'true' : 'false';
  };

  const render = (): void => {
    heldValue.textContent = String(state.heldCodes.size);
    maximumValue.textContent = String(state.maximumDetectedTogether);
    lastValue.textContent = lastDetectedLabel;
    accessibleSummary.textContent =
      `${state.heldCodes.size} ${state.heldCodes.size === 1 ? 'key is' : 'keys are'} held now. ` +
      `Maximum detected together ${state.maximumDetectedTogether}. ` +
      `Last detected key ${lastDetectedLabel}.`;
  };

  const clearHeld = (): void => {
    state.heldCodes.forEach((code) => setPressedVisual(code, false));
    state = clearRolloverHeld(state);
    render();
  };

  const handleEvent = (event: KeyboardInputServiceEvent): void => {
    if (destroyed) return;

    if (event.type === 'clear') {
      clearHeld();
      status.textContent =
        event.reason === 'blur'
          ? 'Held-key state cleared after focus changed'
          : 'Held-key state cleared while the page was hidden';
      return;
    }

    if (event.type === 'keyup') {
      if (event.code && state.heldCodes.has(event.code)) {
        setPressedVisual(event.code, false);
        state = observeRolloverKeyUp(state, event.code);
        render();
      }
      return;
    }

    if (!event.code) return;
    const wasHeld = state.heldCodes.has(event.code);
    state = observeRolloverKeyDown(state, event.code);
    lastDetectedLabel = formatKey(event.key, event.code);
    if (!wasHeld) setPressedVisual(event.code, true);
    root.dataset.state = 'detected';
    status.textContent = 'Keyboard input detected';
    render();
  };

  const handleResetMaximum = (): void => {
    state = resetRolloverMaximum(state);
    render();
  };

  resetButton.addEventListener('click', handleResetMaximum);
  const unsubscribe = service.subscribe(handleEvent);
  const started = service.start();

  if (!started) {
    root.dataset.state = 'unavailable';
    status.textContent = 'Keyboard input unavailable';
    resetButton.disabled = true;
    accessibleSummary.textContent = 'Keyboard input is unavailable in this browser context.';
  } else {
    render();
  }

  return {
    start: () => {
      if (destroyed) return;
      if (service.start()) {
        root.dataset.state = 'ready';
        status.textContent = 'Listening for simultaneous keys';
        resetButton.disabled = false;
        render();
      }
    },
    stop: () => {
      if (destroyed) return;
      clearHeld();
      service.stop();
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      state.heldCodes.forEach((code) => setPressedVisual(code, false));
      resetButton.removeEventListener('click', handleResetMaximum);
      unsubscribe();
      service.destroy();
    },
  };
};
