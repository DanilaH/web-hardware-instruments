import {
  createGamepadService,
  type GamepadServiceState,
  type GamepadSnapshot,
} from '../../../browser/gamepad-service';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';
import {
  FallbackControllerRenderer,
  StandardControllerRenderer,
} from '../../../visuals/controller/controller-renderer';
import {
  createAccessibleControllerSummary,
  createAccessibleFallbackSummary,
  createFallbackControllerView,
  createStandardControllerView,
} from './gamepad-view-model';

export interface ToolController { start(): void; stop(): void; destroy(): void }
type Messages = ToolRuntimeMessages<'gamepadTester'>;
type StatusPresentationKey = 'waiting' | 'connected' | 'unsupported' | 'error';

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Gamepad Tester is missing ${selector}`);
  return element;
};

export const mountGamepadTester = (root: HTMLElement, messages: Messages): ToolController => {
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

  const setStatusPresentation = (key: StatusPresentationKey, state: 'waiting' | 'connected' | 'unavailable', statusText: string, instructionText: string): void => {
    root.dataset.state = state;
    if (lastStatusPresentation === key) return;
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
      const selectedIndex = gamepads.findIndex((gamepad) => gamepad.sourceIndex === selectedSourceIndex);
      if (selectedIndex >= 0 && selector.selectedIndex !== selectedIndex) selector.selectedIndex = selectedIndex;
      return;
    }
    lastControllerListSignature = signature;
    selector.replaceChildren(...gamepads.map((_, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = formatMessage(messages.controllerOption, { number: index + 1 });
      return option;
    }));
    const selectedIndex = gamepads.findIndex((gamepad) => gamepad.sourceIndex === selectedSourceIndex);
    selector.selectedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    selectorWrap.hidden = gamepads.length <= 1;
  };

  const selectFirstAvailable = (gamepads: readonly GamepadSnapshot[]): GamepadSnapshot => {
    const current = gamepads.find((gamepad) => gamepad.sourceIndex === selectedSourceIndex);
    if (current) return current;
    const first = gamepads[0];
    if (!first) throw new Error('Expected a visible gamepad');
    selectedSourceIndex = first.sourceIndex;
    service.setActiveGamepad(first.sourceIndex);
    return first;
  };

  const renderWaiting = (): void => {
    setStatusPresentation('waiting', 'waiting', messages.noController, messages.connectInstruction);
    selectorWrap.hidden = true;
    mappingNote.hidden = true;
    unavailableArea.hidden = true;
    standardArea.hidden = false;
    standardArea.dataset.live = 'false';
    standardRenderer.reset();
    fallbackRenderer.clear();
    accessibleState.textContent = `${messages.noController}. ${messages.connectInstruction}`;
  };

  const renderUnavailable = (kind: 'unsupported' | 'error'): void => {
    const statusText = kind === 'unsupported' ? messages.apiUnavailable : messages.accessUnavailable;
    const instructionText = kind === 'unsupported' ? messages.apiUnavailableInstruction : messages.accessUnavailableInstruction;
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
    setStatusPresentation('connected', 'connected', messages.controllerDetected, messages.connectedInstruction);
    rebuildSelector(gamepads);
    if (gamepad.mapping === 'standard') {
      const view = createStandardControllerView(gamepad, messages);
      mappingNote.hidden = true;
      standardArea.dataset.live = 'true';
      showOnly('standard');
      fallbackRenderer.clear();
      standardRenderer.render(view);
      accessibleState.textContent = createAccessibleControllerSummary(view, messages);
      return;
    }
    const view = createFallbackControllerView(gamepad, messages);
    mappingNote.hidden = false;
    mappingNote.textContent = messages.nonStandardNote;
    showOnly('fallback');
    standardRenderer.reset();
    fallbackRenderer.render(view);
    accessibleState.textContent = createAccessibleFallbackSummary(view, messages);
  };

  const renderState = (state: GamepadServiceState): void => {
    if (destroyed || state.status === 'idle') return;
    if (state.status === 'unsupported' || state.status === 'error') return renderUnavailable(state.status);
    if (state.gamepads.length === 0) {
      selectedSourceIndex = null;
      lastControllerListSignature = '';
      service.setActiveGamepad(null);
      renderWaiting();
      return;
    }
    renderConnected(selectFirstAvailable(state.gamepads), state.gamepads);
  };

  const handleSelectorChange = (): void => {
    const state = service.getState();
    if (state.status !== 'ready') return;
    const selected = state.gamepads[selector.selectedIndex];
    if (!selected) return;
    selectedSourceIndex = selected.sourceIndex;
    service.setActiveGamepad(selected.sourceIndex);
    renderConnected(selected, state.gamepads);
  };

  selector.addEventListener('change', handleSelectorChange);
  const unsubscribe = service.subscribe(renderState);
  service.start();
  return {
    start: () => { if (!destroyed) service.start(); },
    stop: () => { if (!destroyed) service.stop(); },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      selector.removeEventListener('change', handleSelectorChange);
      unsubscribe();
      service.destroy();
      fallbackRenderer.clear();
      standardRenderer.reset();
    },
  };
};
