import {
  createMouseInputService,
  type MouseSemanticButton,
} from '../../../browser/mouse-input-service';
import { renderStandardMouseVisual } from '../../../visuals/mouse/standard-mouse-renderer';
import {
  createDoubleClickState,
  observeButtonPress,
} from './double-click-measurement';

export interface DoubleClickController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Double Click Test is missing ${selector}`);
  return element;
};

const formatGap = (value: number | null): string =>
  value === null ? '—' : `${Math.round(value)} ms`;

export const mountDoubleClickTest = (root: HTMLElement): DoubleClickController => {
  const surface = requireElement<HTMLElement>(root, '[data-double-surface]');
  const visual = requireElement<HTMLElement>(root, '[data-standard-mouse-visual]');
  const status = requireElement<HTMLElement>(root, '[data-double-status]');
  const total = requireElement<HTMLElement>(root, '[data-double-total]');
  const rapid = requireElement<HTMLElement>(root, '[data-double-rapid]');
  const shortest = requireElement<HTMLElement>(root, '[data-double-shortest]');
  const last = requireElement<HTMLElement>(root, '[data-double-last]');
  const reset = requireElement<HTMLButtonElement>(root, '[data-double-reset]');
  const service = createMouseInputService(surface, 'basic');

  let state = createDoubleClickState();
  let held = new Set<MouseSemanticButton>();
  let destroyed = false;
  let available = true;

  const getStatusText = (): string => {
    if (!available) return 'Mouse input unavailable';
    if (state.rapidRepeatEvents > 0) return 'Rapid repeat observed';
    if (state.totalPresses === 0) return 'Listening for slow clicks';
    if (state.shortestGapMs === null) return 'Waiting for another same-button press';
    return 'No rapid repeat observed';
  };

  const render = (): void => {
    const nextStatus = getStatusText();

    if (status.textContent !== nextStatus) status.textContent = nextStatus;
    total.textContent = String(state.totalPresses);
    rapid.textContent = String(state.rapidRepeatEvents);
    shortest.textContent = formatGap(state.shortestGapMs);
    last.textContent = formatGap(state.lastGapMs);
    renderStandardMouseVisual(visual, {
      heldButtons: [0, 1, 2, 3, 4].map((button) =>
        held.has(button as MouseSemanticButton),
      ) as [boolean, boolean, boolean, boolean, boolean],
      wheelDirection: null,
      movementDetected: false,
    });
  };

  const unsubscribe = service.subscribe((event) => {
    if (destroyed || event.type === 'poll-samples') return;

    if (event.type === 'buttondown') {
      held.add(event.button);
      state = observeButtonPress(state, event.button, event.timestamp);
      render();
    } else if (event.type === 'buttonup') {
      held.delete(event.button);
      render();
    } else if (event.type === 'clear') {
      held = new Set();
      render();
    }
  });

  const handleReset = (): void => {
    state = createDoubleClickState();
    held = new Set();
    render();
  };

  reset.addEventListener('click', handleReset);
  available = service.start();
  render();

  return {
    start: () => {
      if (!destroyed) {
        available = service.start();
        render();
      }
    },
    stop: () => {
      if (!destroyed) {
        service.stop();
        held = new Set();
        render();
      }
    },
    destroy: () => {
      if (!destroyed) {
        destroyed = true;
        reset.removeEventListener('click', handleReset);
        unsubscribe();
        service.destroy();
      }
    },
  };
};
