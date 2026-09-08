import { createMouseInputService, isMouseSemanticButton } from '../../../browser/mouse-input-service';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';
import { renderStandardMouseVisual } from '../../../visuals/mouse/standard-mouse-renderer';
import { createMouseButtonState, reduceMouseButtonState, type MouseButtonIndex } from './mouse-button-state';

export interface MouseButtonController { start(): void; stop(): void; destroy(): void; }
type Messages = ToolRuntimeMessages<'mouseButton'>;
const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Mouse Button Test is missing ${selector}`);
  return element;
};
const buttonIndices: readonly MouseButtonIndex[] = [0, 1, 2, 3, 4];

export const mountMouseButtonTest = (root: HTMLElement, messages: Messages): MouseButtonController => {
  const surface = requireElement<HTMLElement>(root, '[data-mouse-button-surface]');
  const visual = requireElement<HTMLElement>(root, '[data-standard-mouse-visual]');
  const status = requireElement<HTMLElement>(root, '[data-mouse-button-status]');
  const reset = requireElement<HTMLButtonElement>(root, '[data-mouse-button-reset]');
  const summary = requireElement<HTMLElement>(root, '[data-mouse-button-summary]');
  const rows = [...root.querySelectorAll<HTMLElement>('[data-mouse-button-row]')];
  const service = createMouseInputService(surface, 'basic');
  let state = createMouseButtonState();
  let destroyed = false;
  let available = true;

  const render = (): void => {
    renderStandardMouseVisual(visual, {
      heldButtons: buttonIndices.map((button) => state.heldButtons.has(button)) as [boolean, boolean, boolean, boolean, boolean],
      wheelDirection: null,
      movementDetected: false,
    });
    rows.forEach((row) => {
      const raw = row.dataset.mouseButtonRow;
      const button = raw === undefined ? Number.NaN : Number(raw);
      if (!isMouseSemanticButton(button)) return;
      row.dataset.held = state.heldButtons.has(button) ? 'true' : 'false';
      const count = row.querySelector<HTMLElement>('[data-button-count]');
      const detected = row.querySelector<HTMLElement>('[data-button-detected]');
      if (count) count.textContent = state.pressCounts[button].toString();
      if (detected) detected.textContent = state.detectedButtons.has(button) ? messages.detected : messages.notDetected;
    });
    status.textContent = !available
      ? messages.unavailable
      : state.detectedButtons.size > 0
        ? formatMessage(messages.rolesDetected, { count: state.detectedButtons.size })
        : messages.listening;
  };

  const unsubscribe = service.subscribe((event) => {
    if (destroyed) return;
    if (event.type === 'buttondown') {
      state = reduceMouseButtonState(state, { type: 'down', button: event.button });
      summary.textContent = formatMessage(messages.buttonSummary, { button: messages.buttonNames[event.button], count: state.pressCounts[event.button] });
      render();
      return;
    }
    if (event.type === 'buttonup') { state = reduceMouseButtonState(state, { type: 'up', button: event.button }); render(); return; }
    if (event.type === 'clear') { state = reduceMouseButtonState(state, { type: 'clear-held' }); render(); }
  });

  const handleReset = (): void => { state = createMouseButtonState(); summary.textContent = messages.initialSummary; render(); };
  reset.addEventListener('click', handleReset);
  available = service.start();
  render();

  return {
    start: () => { if (!destroyed) { available = service.start(); render(); } },
    stop: () => { if (!destroyed) { service.stop(); state = reduceMouseButtonState(state, { type: 'clear-held' }); render(); } },
    destroy: () => { if (!destroyed) { destroyed = true; reset.removeEventListener('click', handleReset); unsubscribe(); service.destroy(); } },
  };
};
