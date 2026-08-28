import {
  createMouseInputService,
  isMouseSemanticButton,
  type MouseInputServiceEvent,
} from '../../../browser/mouse-input-service';
import { renderStandardMouseVisual } from '../../../visuals/mouse/standard-mouse-renderer';
import { createMouseTesterState, reduceMouseTesterState, type MouseTesterState } from './mouse-tester-state';

export interface MouseTesterController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Mouse Tester is missing ${selector}`);
  }
  return element;
};

const buttonNames = ['Primary', 'Middle', 'Secondary', 'Back', 'Forward'] as const;

const toHeldTuple = (state: MouseTesterState): [boolean, boolean, boolean, boolean, boolean] => [
  state.heldButtons.has(0),
  state.heldButtons.has(1),
  state.heldButtons.has(2),
  state.heldButtons.has(3),
  state.heldButtons.has(4),
];

const wheelLabel = (direction: MouseTesterState['wheelDirection']): string => {
  if (direction === 'up') return 'Up';
  if (direction === 'down') return 'Down';
  if (direction === 'horizontal') return 'Horizontal';
  return 'Waiting';
};

export const mountMouseTester = (root: HTMLElement): MouseTesterController => {
  const surface = requireElement<HTMLElement>(root, '[data-mouse-test-surface]');
  const visual = requireElement<HTMLElement>(root, '[data-standard-mouse-visual]');
  const status = requireElement<HTMLElement>(root, '[data-mouse-status]');
  const wheel = requireElement<HTMLElement>(root, '[data-mouse-wheel]');
  const movement = requireElement<HTMLElement>(root, '[data-mouse-movement]');
  const reset = requireElement<HTMLButtonElement>(root, '[data-mouse-reset]');
  const note = requireElement<HTMLElement>(root, '[data-mouse-note]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-mouse-accessible-summary]');
  const countElements = [...root.querySelectorAll<HTMLElement>('[data-mouse-button-count]')];

  const service = createMouseInputService(surface, 'basic');
  let state = createMouseTesterState();
  let destroyed = false;
  let announcedDetection = false;

  const render = (): void => {
    root.dataset.state = state.anyInputDetected ? 'detected' : 'ready';
    renderStandardMouseVisual(visual, {
      heldButtons: toHeldTuple(state),
      wheelDirection: state.wheelDirection,
      movementDetected: state.movementDetected,
    });

    countElements.forEach((element) => {
      const raw = element.dataset.mouseButtonCount;
      const button = raw === undefined ? Number.NaN : Number(raw);
      if (isMouseSemanticButton(button)) {
        element.textContent = state.pressCounts[button].toString();
        const row = element.closest<HTMLElement>('[data-mouse-button-row]');
        if (row) {
          row.dataset.held = state.heldButtons.has(button) ? 'true' : 'false';
        }
      }
    });

    wheel.textContent = wheelLabel(state.wheelDirection);
    movement.textContent = state.movementDetected ? 'Detected' : 'Waiting';
  };

  const describeEvent = (event: MouseInputServiceEvent): string | null => {
    if (event.type === 'buttondown') {
      return `${buttonNames[event.button]} button detected. ${state.pressCounts[event.button]} presses observed.`;
    }
    if (event.type === 'wheel' && state.wheelDirection) {
      return `${wheelLabel(state.wheelDirection)} wheel input detected.`;
    }
    if (event.type === 'move' && state.movementDetected) {
      return 'Mouse movement detected.';
    }
    if (event.type === 'clear') {
      return event.reason === 'blur'
        ? 'Held mouse-button state cleared because the page lost focus.'
        : 'Held mouse-button state cleared because the page became hidden.';
    }
    return null;
  };

  const handleEvent = (event: MouseInputServiceEvent): void => {
    if (destroyed || event.type === 'poll-samples') {
      return;
    }

    state = reduceMouseTesterState(state, event);
    render();

    if (state.anyInputDetected && !announcedDetection) {
      announcedDetection = true;
      status.textContent = 'Input detected';
    }

    const description = describeEvent(event);
    if (description && event.type !== 'move') {
      accessibleSummary.textContent = description;
    }
  };

  const resetVisibleState = (): void => {
    state = createMouseTesterState();
    announcedDetection = false;
    status.textContent = 'Listening for mouse input';
    accessibleSummary.textContent = 'Mouse Tester is listening. Move, click, or scroll inside the test area.';
    render();
  };

  const unsubscribe = service.subscribe(handleEvent);
  const handleReset = (): void => resetVisibleState();
  reset.addEventListener('click', handleReset);

  const started = service.start();
  if (!started) {
    root.dataset.state = 'unavailable';
    status.textContent = 'Mouse input unavailable';
    note.textContent = 'This browser context could not attach mouse input listeners.';
    accessibleSummary.textContent = 'Mouse input is unavailable in this browser context.';
  } else {
    render();
  }

  return {
    start: () => {
      if (destroyed) return;
      if (service.start()) {
        status.textContent = state.anyInputDetected ? 'Input detected' : 'Listening for mouse input';
        render();
      }
    },
    stop: () => {
      if (destroyed) return;
      service.stop();
      state = reduceMouseTesterState(state, { type: 'clear', reason: 'blur' });
      render();
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      reset.removeEventListener('click', handleReset);
      unsubscribe();
      service.destroy();
    },
  };
};
