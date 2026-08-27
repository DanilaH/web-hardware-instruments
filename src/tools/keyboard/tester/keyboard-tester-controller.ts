import {
  createKeyboardInputService,
  type KeyboardInputServiceEvent,
} from '../../../browser/keyboard-input-service';

export interface KeyboardTesterController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Keyboard Tester is missing ${selector}`);
  }
  return element;
};

const formatKey = (key: string): string => {
  if (key === ' ') {
    return 'Space';
  }
  return key || 'Unidentified';
};

export const mountKeyboardTester = (root: HTMLElement): KeyboardTesterController => {
  const status = requireElement<HTMLElement>(root, '[data-keyboard-status]');
  const lastKey = requireElement<HTMLElement>(root, '[data-keyboard-last-key]');
  const lastCode = requireElement<HTMLElement>(root, '[data-keyboard-last-code]');
  const pressedCount = requireElement<HTMLElement>(root, '[data-keyboard-pressed-count]');
  const note = requireElement<HTMLElement>(root, '[data-keyboard-note]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-keyboard-accessible-summary]');
  const keyElements = [...root.querySelectorAll<HTMLElement>('[data-key-code]')];
  const keyElementsByCode = new Map<string, HTMLElement>();

  keyElements.forEach((element) => {
    const code = element.dataset.keyCode;
    if (code) {
      keyElementsByCode.set(code, element);
    }
  });

  const service = createKeyboardInputService();
  const pressedCodes = new Set<string>();
  let destroyed = false;

  const renderPressedCount = (): void => {
    pressedCount.textContent = pressedCodes.size.toString();
  };

  const setPressedVisual = (code: string, pressed: boolean): void => {
    const element = keyElementsByCode.get(code);
    if (element) {
      element.dataset.pressed = pressed ? 'true' : 'false';
    }
  };

  const clearPressed = (): void => {
    pressedCodes.forEach((code) => setPressedVisual(code, false));
    pressedCodes.clear();
    renderPressedCount();
  };

  const handleEvent = (event: KeyboardInputServiceEvent): void => {
    if (destroyed) {
      return;
    }

    if (event.type === 'clear') {
      clearPressed();
      accessibleSummary.textContent =
        event.reason === 'blur'
          ? 'Held-key state cleared because the page lost focus.'
          : 'Held-key state cleared because the page became hidden.';
      return;
    }

    if (event.type === 'keyup') {
      if (event.code && pressedCodes.delete(event.code)) {
        setPressedVisual(event.code, false);
        renderPressedCount();
      }
      return;
    }

    const visibleKey = formatKey(event.key);
    const visibleCode = event.code || 'Unidentified';
    lastKey.textContent = visibleKey;
    lastCode.textContent = visibleCode;
    root.dataset.state = 'detected';
    status.textContent = 'Key detected';

    if (event.code && !pressedCodes.has(event.code)) {
      pressedCodes.add(event.code);
      setPressedVisual(event.code, true);
      renderPressedCount();
    }

    accessibleSummary.textContent =
      `Last detected key ${visibleKey}. Physical code ${visibleCode}. ` +
      `${pressedCodes.size} ${pressedCodes.size === 1 ? 'key is' : 'keys are'} currently held.`;
  };

  const unsubscribe = service.subscribe(handleEvent);
  const started = service.start();

  if (!started) {
    root.dataset.state = 'unavailable';
    status.textContent = 'Keyboard input unavailable';
    note.textContent = 'This browser context could not attach keyboard input listeners.';
    accessibleSummary.textContent = 'Keyboard input is unavailable in this browser context.';
  }

  return {
    start: () => {
      if (destroyed) {
        return;
      }
      if (service.start()) {
        root.dataset.state = 'ready';
        status.textContent = 'Listening for keys';
      }
    },
    stop: () => {
      if (destroyed) {
        return;
      }
      clearPressed();
      service.stop();
    },
    destroy: () => {
      if (destroyed) {
        return;
      }
      destroyed = true;
      clearPressed();
      unsubscribe();
      service.destroy();
    },
  };
};
