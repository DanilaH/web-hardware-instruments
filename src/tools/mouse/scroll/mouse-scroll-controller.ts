import { createMouseInputService } from '../../../browser/mouse-input-service';
import type { ToolRuntimeMessages } from '../../../i18n/runtime';
import { createMouseScrollState, observeWheel, type ScrollDirection } from './mouse-scroll-state';

export interface MouseScrollController { start(): void; stop(): void; destroy(): void; }
type Messages = ToolRuntimeMessages<'mouseScroll'>;
const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Mouse Scroll Test is missing ${selector}`);
  return element;
};
const symbol = (direction: ScrollDirection): string => direction === 'up' ? '↑' : direction === 'down' ? '↓' : direction === 'left' ? '←' : '→';

export const mountMouseScrollTest = (root: HTMLElement, messages: Messages): MouseScrollController => {
  const surface = requireElement<HTMLElement>(root, '[data-scroll-surface]');
  const status = requireElement<HTMLElement>(root, '[data-scroll-status]');
  const strip = requireElement<HTMLElement>(root, '[data-scroll-strip]');
  const reset = requireElement<HTMLButtonElement>(root, '[data-scroll-reset]');
  const up = requireElement<HTMLElement>(root, '[data-scroll-up]');
  const down = requireElement<HTMLElement>(root, '[data-scroll-down]');
  const left = requireElement<HTMLElement>(root, '[data-scroll-left]');
  const right = requireElement<HTMLElement>(root, '[data-scroll-right]');
  const service = createMouseInputService(surface, 'basic');
  let state = createMouseScrollState();
  let destroyed = false;
  let available = true;

  const render = (): void => {
    up.textContent = String(state.up);
    down.textContent = String(state.down);
    left.textContent = String(state.left);
    right.textContent = String(state.right);
    strip.textContent = state.recent.length ? state.recent.map(symbol).join(' ') : messages.scrollInside;
    status.textContent = !available ? messages.unavailable : state.recent.length ? messages.detected : messages.listening;
  };
  const unsubscribe = service.subscribe((event) => {
    if (destroyed || event.type !== 'wheel') return;
    const next = observeWheel(state, event.deltaX, event.deltaY);
    if (next !== state) { state = next; render(); }
  });
  const handleReset = (): void => { state = createMouseScrollState(); render(); };
  reset.addEventListener('click', handleReset);
  available = service.start();
  render();
  return {
    start: () => { if (!destroyed) { available = service.start(); render(); } },
    stop: () => { if (!destroyed) service.stop(); },
    destroy: () => { if (!destroyed) { destroyed = true; reset.removeEventListener('click', handleReset); unsubscribe(); service.destroy(); } },
  };
};
