import {
  createGamepadService,
  type GamepadServiceState,
  type GamepadSnapshot,
} from '../../../browser/gamepad-service';
import {
  FallbackControllerRenderer,
  StandardControllerRenderer,
} from '../../../visuals/controller/controller-renderer';
import {
  createAccessibleControllerSummary,
  createStandardControllerView,
} from './gamepad-view-model';

export interface ToolController {
  destroy(): void;
}

type StatusPresentationKey = 'waiting' | 'connected' | 'unsupported' | 'error';

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Gamepad Tester is missing ${selector}`);
  }
  return element;
};

export const mountGamepadTester = (root: HTMLElement): ToolController => {
  const status = requireElement<HTMLElement>(root, '[data-gamepad-status]');
  const instruction = requireElement<HTMLElement>(root, '[data-gamepad-instruction]');
  const statusLive = requireElement<HTMLElement>(root, '[data-gamepad-status-live]');
  const selectorWrap = requireElement<HTMLElement>(root, '[data-gamepad-selector-wrap]');
  const selector = requireElement<HTMLSelectElement>(root, '[data-gamepad-selector]');
  const standardArea = requireElement<HTMLElement>(root, '[data-standard-controller]');
  const fallbackArea = requireElement<HTMLElement>(root, '[data-fallback-controller]');
  const fallbackContent = requireElement<HTMLElement>(root, '[data-fallback-content]');
  const unavailableArea = requireElement<HTMLElement>(root, '[data-gamepad-unavailable]');
  const mappingNote = requireElement<HTMLElement>(root, '[data-gamepad-mapping-note]');
  const accessibleState = requireElement<HTMLElement>(root, '[data-gamepad-accessible-state]');

  const service = createGamepadService();
  const standardRenderer = new StandardControllerRenderer(standardArea);
  const fallbackRenderer = new FallbackControllerRenderer(fallbackContent);

  let selectedSourceIndex: number | null = null;
  let lastControllerListSignature = '';
  let lastStatusPresentation: StatusPresentationKey | null = null;
  let destroyed = false;

  const setStatusPresentation = (
    key: StatusPresentationKey,
    state: 'waiting' | 'connected' | 'unavailable',
    statusText: string,
    instructionText: string,
  ): void => {
    root.dataset.state = state;

    if (lastStatusPresentation === key) {
      return;
    }

    status.textContent = statusText;
    instruction.textContent = instructionText;
    statusLive.textContent = `${statusText}. ${instructionText}`;
    lastStatusPresentation = key;
  };

  const showOnly = (mode: 'standard' | 'fallback' | 'unavailable'): void => {
    standardArea.hidden = mode !== 'standard';
    fallbackArea.hidden = mode !== 'fallback';
    unavailableArea.hidden = mode !== 'unavailable';
  };

  const rebuildSelector = (gamepads: readonly GamepadSnapshot[]): void => {
    const signature = gamepads.map((gamepad) => gamepad.sourceIndex).join(',');
    if (signature === lastControllerListSignature) {
      const selectedIndex = gamepads.findIndex(
        (gamepad) => gamepad.sourceIndex === selectedSourceIndex,
      );
      if (selectedIndex >= 0 && selector.selectedIndex !== selectedIndex) {
        selector.selectedIndex = selectedIndex;
      }
      return;
    }

    lastControllerListSignature = signature;
    selector.replaceChildren(
      ...gamepads.map((_, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `Controller ${index + 1}`;
        return option;
      }),
    );

    const selectedIndex = gamepads.findIndex(
      (gamepad) => gamepad.sourceIndex === selectedSourceIndex,
    );
    selector.selectedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    selectorWrap.hidden = gamepads.length <= 1;
  };

  const selectFirstAvailable = (gamepads: readonly GamepadSnapshot[]): GamepadSnapshot => {
    const current = gamepads.find((gamepad) => gamepad.sourceIndex === selectedSourceIndex);
    if (current) {
      return current;
    }

    const first = gamepads[0];
    if (!first) {
      throw new Error('Expected a visible gamepad');
    }

    selectedSourceIndex = first.sourceIndex;
    service.setActiveGamepad(first.sourceIndex);
    return first;
  };

  const renderWaiting = (): void => {
    setStatusPresentation(
      'waiting',
      'waiting',
      'No controller detected',
      'Connect a controller and press any button.',
    );
    selectorWrap.hidden = true;
    mappingNote.hidden = true;
    unavailableArea.hidden = true;
    standardArea.hidden = false;
    standardArea.dataset.live = 'false';
    standardRenderer.reset();
    fallbackRenderer.clear();
    accessibleState.textContent = 'No controller detected. Connect a controller and press any button.';
  };

  const renderUnavailable = (kind: 'unsupported' | 'error'): void => {
    const statusText =
      kind === 'unsupported' ? 'Gamepad API unavailable' : 'Gamepad access unavailable';
    const instructionText =
      kind === 'unsupported'
        ? 'This browser does not expose the Gamepad API.'
        : 'Gamepad access is blocked or unavailable in this browser context.';

    setStatusPresentation(kind, 'unavailable', statusText, instructionText);
    selectorWrap.hidden = true;
    mappingNote.hidden = true;
    selectedSourceIndex = null;
    service.setActiveGamepad(null);
    standardRenderer.reset();
    fallbackRenderer.clear();
    showOnly('unavailable');
    accessibleState.textContent = `${statusText}. ${instructionText}`;
  };

  const renderConnected = (gamepad: GamepadSnapshot, gamepads: readonly GamepadSnapshot[]): void => {
    setStatusPresentation(
      'connected',
      'connected',
      'Controller detected',
      'Press buttons and move the sticks to test them.',
    );
    rebuildSelector(gamepads);

    if (gamepad.mapping === 'standard') {
      const view = createStandardControllerView(gamepad);
      mappingNote.hidden = true;
      standardArea.dataset.live = 'true';
      showOnly('standard');
      fallbackRenderer.clear();
      standardRenderer.render(view);
      accessibleState.textContent = createAccessibleControllerSummary(view);
      return;
    }

    mappingNote.hidden = false;
    mappingNote.textContent =
      'Basic input view — this controller does not expose the standard mapping, so physical button and axis positions are not assumed.';
    showOnly('fallback');
    standardRenderer.reset();
    fallbackRenderer.render(gamepad);
    accessibleState.textContent = `Controller detected with a non-standard mapping. ${gamepad.buttons.filter((button) => button.pressed).length} buttons are currently pressed.`;
  };

  const renderState = (state: GamepadServiceState): void => {
    if (destroyed || state.status === 'idle') {
      return;
    }

    if (state.status === 'unsupported' || state.status === 'error') {
      renderUnavailable(state.status);
      return;
    }

    if (state.gamepads.length === 0) {
      selectedSourceIndex = null;
      lastControllerListSignature = '';
      service.setActiveGamepad(null);
      renderWaiting();
      return;
    }

    const selected = selectFirstAvailable(state.gamepads);
    renderConnected(selected, state.gamepads);
  };

  const handleSelectorChange = (): void => {
    const state = service.getState();
    if (state.status !== 'ready') {
      return;
    }

    const selected = state.gamepads[selector.selectedIndex];
    if (!selected) {
      return;
    }

    selectedSourceIndex = selected.sourceIndex;
    service.setActiveGamepad(selected.sourceIndex);
    renderConnected(selected, state.gamepads);
  };

  selector.addEventListener('change', handleSelectorChange);
  const unsubscribe = service.subscribe(renderState);
  service.start();

  return {
    destroy: () => {
      if (destroyed) {
        return;
      }

      destroyed = true;
      selector.removeEventListener('change', handleSelectorChange);
      unsubscribe();
      service.destroy();
      fallbackRenderer.clear();
      standardRenderer.reset();
    },
  };
};
