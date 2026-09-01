import {
  createMouseInputService,
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

const buttonNames = ['Primary', 'Middle', 'Secondary', 'Back / X1', 'Forward / X2'] as const;

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

const detectedRoleCount = (state: MouseTesterState): number =>
  state.pressCounts.filter((count) => count > 0).length;

export const mountMouseTester = (root: HTMLElement): MouseTesterController => {
  const surface = requireElement<HTMLElement>(root, '[data-mouse-test-surface]');
  const visual = requireElement<HTMLElement>(root, '[data-standard-mouse-visual]');
  const status = requireElement<HTMLElement>(root, '[data-mouse-status]');
  const lastButton = requireElement<HTMLElement>(root, '[data-mouse-last-button]');
  const rolesSeen = requireElement<HTMLElement>(root, '[data-mouse-roles-seen]');
  const wheel = requireElement<HTMLElement>(root, '[data-mouse-wheel]');
  const movement = requireElement<HTMLElement>(root, '[data-mouse-movement]');
  const reset = requireElement<HTMLButtonElement>(root, '[data-mouse-reset]');
  const note = requireElement<HTMLElement>(root, '[data-mouse-note]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-mouse-accessible-summary]');

  const service = createMouseInputService(surface, 'basic');
  let state = createMouseTesterState();
  let lastButtonLabel = 'Waiting';
  let destroyed = false;
  let announcedDetection = false;

  const render = (): void => {
    root.dataset.state = state.anyInputDetected ? 'detected' : 'ready';
    renderStandardMouseVisual(visual, {
      heldButtons: toHeldTuple(state),
      wheelDirection: state.wheelDirection,
      movementDetected: state.movementDetected,
    });

    lastButton.textContent = lastButtonLabel;
    rolesSeen.textContent = `${detectedRoleCount(state)} / 5`;
    wheel.textContent = wheelLabel(state.wheelDirection);
    movement.textContent = state.movementDetected ? 'Detected' : 'Waiting';
  };

  const describeEvent = (event: MouseInputServiceEvent): string | null => {
    if (event.type === 'buttondown') {
      return `${buttonNames[event.button]} button detected. ${detectedRoleCount(state)} of 5 button roles seen.`;
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
    if (event.type === 'buttondown') {
      lastButtonLabel = buttonNames[event.button];
    }
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
    lastButtonLabel = 'Waiting';
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
