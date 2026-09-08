import { createKeyboardInputService, type KeyboardInputServiceEvent } from '../../../browser/keyboard-input-service';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';

export interface KeyboardTesterController { start(): void; stop(): void; destroy(): void; }
type Messages = ToolRuntimeMessages<'keyboardTester'>;
const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Keyboard Tester is missing ${selector}`);
  return element;
};

export const mountKeyboardTester = (root: HTMLElement, messages: Messages): KeyboardTesterController => {
  const status = requireElement<HTMLElement>(root, '[data-keyboard-status]');
  const lastKey = requireElement<HTMLElement>(root, '[data-keyboard-last-key]');
  const lastCode = requireElement<HTMLElement>(root, '[data-keyboard-last-code]');
  const pressedCount = requireElement<HTMLElement>(root, '[data-keyboard-pressed-count]');
  const noteCopy = requireElement<HTMLElement>(root, '[data-keyboard-note-copy]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-keyboard-accessible-summary]');
  const keyElements = [...root.querySelectorAll<HTMLElement>('[data-key-code]')];
  const keyElementsByCode = new Map<string, HTMLElement>();
  keyElements.forEach((element) => { const code = element.dataset.keyCode; if (code) keyElementsByCode.set(code, element); });
  const service = createKeyboardInputService();
  const pressedCodes = new Set<string>();
  let destroyed = false;
  const formatKey = (key: string): string => key === ' ' ? messages.space : key || messages.unidentified;
  const renderPressedCount = (): void => { pressedCount.textContent = pressedCodes.size.toString(); };
  const setPressedVisual = (code: string, pressed: boolean): void => { const element = keyElementsByCode.get(code); if (element) element.dataset.pressed = pressed ? 'true' : 'false'; };
  const clearPressed = (): void => { pressedCodes.forEach((code) => setPressedVisual(code, false)); pressedCodes.clear(); renderPressedCount(); };
  const handleEvent = (event: KeyboardInputServiceEvent): void => {
    if (destroyed) return;
    if (event.type === 'clear') {
      clearPressed();
      accessibleSummary.textContent = event.reason === 'blur' ? messages.clearedBlur : messages.clearedHidden;
      return;
    }
    if (event.type === 'keyup') {
      if (event.code && pressedCodes.delete(event.code)) { setPressedVisual(event.code, false); renderPressedCount(); }
      return;
    }
    const visibleKey = formatKey(event.key);
    const visibleCode = event.code || messages.unidentified;
    lastKey.textContent = visibleKey;
    lastCode.textContent = visibleCode;
    root.dataset.state = 'detected';
    status.textContent = messages.keyDetected;
    if (event.code && !pressedCodes.has(event.code)) { pressedCodes.add(event.code); setPressedVisual(event.code, true); renderPressedCount(); }
    accessibleSummary.textContent = formatMessage(messages.heldSummary, { key: visibleKey, code: visibleCode, count: pressedCodes.size, heldWord: pressedCodes.size === 1 ? messages.heldOne : messages.heldMany });
  };
  const unsubscribe = service.subscribe(handleEvent);
  const started = service.start();
  if (!started) {
    root.dataset.state = 'unavailable';
    status.textContent = messages.unavailable;
    noteCopy.textContent = messages.unavailableNote;
    accessibleSummary.textContent = messages.unavailableSummary;
  }
  return {
    start: () => { if (!destroyed && service.start()) { root.dataset.state = 'ready'; status.textContent = messages.listening; noteCopy.textContent = messages.note; } },
    stop: () => { if (!destroyed) { clearPressed(); service.stop(); } },
    destroy: () => { if (!destroyed) { destroyed = true; clearPressed(); unsubscribe(); service.destroy(); } },
  };
};
