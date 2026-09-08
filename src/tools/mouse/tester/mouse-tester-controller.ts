import { createMouseInputService, type MouseInputServiceEvent } from '../../../browser/mouse-input-service';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';
import { renderStandardMouseVisual } from '../../../visuals/mouse/standard-mouse-renderer';
import { createMouseTesterState, reduceMouseTesterState, type MouseTesterState } from './mouse-tester-state';

export interface MouseTesterController { start(): void; stop(): void; destroy(): void; }
type Messages = ToolRuntimeMessages<'mouseTester'>;
const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Mouse Tester is missing ${selector}`);
  return element;
};
const toHeldTuple = (state: MouseTesterState): [boolean, boolean, boolean, boolean, boolean] => [state.heldButtons.has(0), state.heldButtons.has(1), state.heldButtons.has(2), state.heldButtons.has(3), state.heldButtons.has(4)];
const detectedRoleCount = (state: MouseTesterState): number => state.pressCounts.filter((count) => count > 0).length;

export const mountMouseTester = (root: HTMLElement, messages: Messages): MouseTesterController => {
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
  let lastButtonLabel = messages.waiting;
  let destroyed = false;
  let announcedDetection = false;

  const wheelLabel = (direction: MouseTesterState['wheelDirection']): string => {
    if (direction === 'up') return messages.wheelUp;
    if (direction === 'down') return messages.wheelDown;
    if (direction === 'horizontal') return messages.wheelHorizontal;
    return messages.waiting;
  };

  const render = (): void => {
    root.dataset.state = state.anyInputDetected ? 'detected' : 'ready';
    renderStandardMouseVisual(visual, { heldButtons: toHeldTuple(state), wheelDirection: state.wheelDirection, movementDetected: state.movementDetected });
    lastButton.textContent = lastButtonLabel;
    rolesSeen.textContent = `${detectedRoleCount(state)} / 5`;
    wheel.textContent = wheelLabel(state.wheelDirection);
    movement.textContent = state.movementDetected ? messages.detected : messages.waiting;
  };

  const updateAccessibleSummary = (): void => {
    accessibleSummary.textContent = formatMessage(messages.eventSummary, {
      button: lastButtonLabel,
      roles: detectedRoleCount(state),
      wheel: wheelLabel(state.wheelDirection),
      movement: state.movementDetected ? messages.detected : messages.waiting,
    });
  };

  const handleEvent = (event: MouseInputServiceEvent): void => {
    if (destroyed || event.type === 'poll-samples') return;
    state = reduceMouseTesterState(state, event);
    if (event.type === 'buttondown') lastButtonLabel = messages.buttonNames[event.button];
    render();
    if (state.anyInputDetected && !announcedDetection) {
      announcedDetection = true;
      status.textContent = messages.inputDetected;
    }
    if (event.type !== 'move') updateAccessibleSummary();
  };

  const resetVisibleState = (): void => {
    state = createMouseTesterState();
    lastButtonLabel = messages.waiting;
    announcedDetection = false;
    status.textContent = messages.listening;
    accessibleSummary.textContent = messages.initialSummary;
    note.textContent = messages.suppressionNote;
    render();
  };

  const unsubscribe = service.subscribe(handleEvent);
  const handleReset = (): void => resetVisibleState();
  reset.addEventListener('click', handleReset);
  const started = service.start();
  if (!started) {
    root.dataset.state = 'unavailable';
    status.textContent = messages.unavailable;
    note.textContent = messages.unavailable;
    accessibleSummary.textContent = messages.unavailable;
  } else render();

  return {
    start: () => {
      if (destroyed) return;
      if (service.start()) {
        status.textContent = state.anyInputDetected ? messages.inputDetected : messages.listening;
        note.textContent = messages.suppressionNote;
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
