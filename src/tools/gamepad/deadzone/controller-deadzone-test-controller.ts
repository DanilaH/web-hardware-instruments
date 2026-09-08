import {
  createGamepadService,
  type GamepadServiceState,
  type GamepadSnapshot,
} from '../../../browser/gamepad-service';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';
import { StickDeadzonePlotRenderer } from '../../../visuals/controller/stick-deadzone-plot-renderer';
import { getStandardStickPosition } from '../gamepad-stick-adapter';
import type { StickPosition, StickSide } from '../stick-position';
import {
  calculateDeadzoneMeasurement,
  formatCenterNoisePercent,
} from './controller-deadzone-measurement';

export interface ControllerDeadzoneToolController {
  start(): void;
  stop(): void;
  destroy(): void;
}

export interface ControllerDeadzoneMessages {
  common: ToolRuntimeMessages<'gamepadTester'>;
  tool: ToolRuntimeMessages<'deadzone'>;
}

type ToolState = 'waiting' | 'ready' | 'sampling' | 'result' | 'cancelled' | 'unavailable';
type PresentationKey =
  | 'waiting'
  | 'ready'
  | 'sampling'
  | 'result'
  | 'cancelled'
  | 'mapping'
  | 'unsupported'
  | 'error';

const SAMPLE_DURATION_MS = 3_000;

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Controller Deadzone Test is missing ${selector}`);
  }
  return element;
};

export const mountControllerDeadzoneTest = (
  root: HTMLElement,
  messages: ControllerDeadzoneMessages,
): ControllerDeadzoneToolController => {
  const { common, tool } = messages;
  const status = requireElement<HTMLElement>(root, '[data-deadzone-status]');
  const instruction = requireElement<HTMLElement>(root, '[data-deadzone-instruction]');
  const statusLive = requireElement<HTMLElement>(root, '[data-deadzone-status-live]');
  const selectorWrap = requireElement<HTMLElement>(root, '[data-deadzone-selector-wrap]');
  const selector = requireElement<HTMLSelectElement>(root, '[data-deadzone-selector]');
  const stickChoice = requireElement<HTMLFieldSetElement>(root, '[data-deadzone-stick-choice]');
  const stickInputs = [...root.querySelectorAll<HTMLInputElement>('[data-deadzone-stick]')];
  const startButton = requireElement<HTMLButtonElement>(root, '[data-deadzone-start]');
  const progress = requireElement<HTMLElement>(root, '[data-deadzone-progress]');
  const noiseResult = requireElement<HTMLElement>(root, '[data-deadzone-noise-result]');
  const suggestionResult = requireElement<HTMLElement>(root, '[data-deadzone-suggestion-result]');
  const limitation = requireElement<HTMLElement>(root, '[data-deadzone-limitation]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-deadzone-accessible-summary]');
  const plotRoot = requireElement<HTMLElement>(root, '[data-stick-deadzone-plot]');

  if (stickInputs.length !== 2) {
    throw new Error('Controller Deadzone Test requires left and right stick choices');
  }

  const service = createGamepadService();
  const renderer = new StickDeadzonePlotRenderer(plotRoot);

  let destroyed = false;
  let toolState: ToolState = 'waiting';
  let selectedSourceIndex: number | null = null;
  let selectedStick: StickSide = 'left';
  let lastControllerListSignature = '';
  let lastPresentation: PresentationKey | null = null;
  let sampleStartedAt: number | null = null;
  let samples: StickPosition[] = [];

  const selectedStickLabel = (): string =>
    selectedStick === 'left' ? tool.leftStick : tool.rightStick;

  const setPresentation = (
    key: PresentationKey,
    state: ToolState,
    statusText: string,
    instructionText: string,
  ): void => {
    toolState = state;
    root.dataset.state = state;

    if (lastPresentation === key) {
      return;
    }

    status.textContent = statusText;
    instruction.textContent = instructionText;
    statusLive.textContent = `${statusText}. ${instructionText}`;
    lastPresentation = key;
  };

  const resetMeasurement = (): void => {
    sampleStartedAt = null;
    samples = [];
    noiseResult.textContent = '—';
    suggestionResult.textContent = '—';
    progress.textContent = '3 s';
    renderer.resetResult();
  };

  const rebuildSelector = (gamepads: readonly GamepadSnapshot[]): void => {
    const signature = gamepads.map((gamepad) => gamepad.sourceIndex).join(',');
    if (signature !== lastControllerListSignature) {
      lastControllerListSignature = signature;
      selector.replaceChildren(
        ...gamepads.map((_, index) => {
          const option = document.createElement('option');
          option.value = String(index);
          option.textContent = formatMessage(common.controllerOption, { number: index + 1 });
          return option;
        }),
      );
    }

    const selectedIndex = gamepads.findIndex(
      (gamepad) => gamepad.sourceIndex === selectedSourceIndex,
    );
    selector.selectedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    selectorWrap.hidden = gamepads.length <= 1;
    selector.disabled = toolState === 'sampling';
  };

  const selectFirstAvailable = (gamepads: readonly GamepadSnapshot[]): GamepadSnapshot => {
    const selected = gamepads.find((gamepad) => gamepad.sourceIndex === selectedSourceIndex);
    if (selected) {
      return selected;
    }

    const first = gamepads[0];
    if (!first) {
      throw new Error('Expected a visible controller');
    }

    selectedSourceIndex = first.sourceIndex;
    service.setActiveGamepad(first.sourceIndex);
    return first;
  };

  const renderWaiting = (): void => {
    selectedSourceIndex = null;
    lastControllerListSignature = '';
    selectorWrap.hidden = true;
    stickChoice.disabled = true;
    startButton.disabled = true;
    startButton.textContent = tool.start;
    limitation.hidden = true;
    resetMeasurement();
    renderer.reset();
    renderer.setSideLabel(selectedStickLabel());
    setPresentation('waiting', 'waiting', common.noController, common.connectInstruction);
    accessibleSummary.textContent = `${common.noController}. ${common.connectInstruction}`;
  };

  const renderApiUnavailable = (kind: 'unsupported' | 'error'): void => {
    selectedSourceIndex = null;
    service.setActiveGamepad(null);
    selectorWrap.hidden = true;
    stickChoice.disabled = true;
    startButton.disabled = true;
    startButton.textContent = tool.start;
    resetMeasurement();
    renderer.reset();
    renderer.setSideLabel(selectedStickLabel());

    const unsupported = kind === 'unsupported';
    const statusText = unsupported ? common.apiUnavailable : common.accessUnavailable;
    const instructionText = unsupported
      ? common.apiUnavailableInstruction
      : common.accessUnavailableInstruction;

    limitation.hidden = false;
    limitation.textContent = instructionText;
    setPresentation(kind, 'unavailable', statusText, instructionText);
    accessibleSummary.textContent = `${statusText}. ${instructionText}`;
  };

  const renderMappingUnavailable = (gamepads: readonly GamepadSnapshot[]): void => {
    rebuildSelector(gamepads);
    stickChoice.disabled = true;
    startButton.disabled = true;
    startButton.textContent = tool.start;
    resetMeasurement();
    renderer.reset();
    renderer.setSideLabel(selectedStickLabel());
    limitation.hidden = false;
    limitation.textContent = tool.unavailableDetail;
    setPresentation('mapping', 'unavailable', tool.unavailable, tool.unavailableDetail);
    accessibleSummary.textContent = `${tool.unavailable}. ${tool.unavailableDetail}`;
  };

  const renderReady = (gamepad: GamepadSnapshot, gamepads: readonly GamepadSnapshot[]): void => {
    const position = getStandardStickPosition(gamepad, selectedStick);
    if (!position) {
      renderMappingUnavailable(gamepads);
      return;
    }

    rebuildSelector(gamepads);
    selector.disabled = false;
    stickChoice.disabled = false;
    startButton.disabled = false;
    startButton.textContent = toolState === 'result' ? tool.testAgain : tool.start;
    limitation.hidden = toolState !== 'cancelled';
    renderer.setSideLabel(selectedStickLabel());
    renderer.renderPosition(position);

    if (toolState === 'result' || toolState === 'cancelled') {
      return;
    }

    setPresentation('ready', 'ready', tool.statusReady, tool.connect);
    accessibleSummary.textContent = `${tool.readySummary} ${tool.connect}`;
  };

  const cancelMeasurement = (): void => {
    if (toolState !== 'sampling') {
      return;
    }

    resetMeasurement();
    selector.disabled = false;
    stickChoice.disabled = false;
    startButton.disabled = false;
    startButton.textContent = tool.start;
    limitation.hidden = false;
    limitation.textContent = tool.cancelledDetail;
    setPresentation('cancelled', 'cancelled', tool.cancelled, tool.cancelledDetail);
    accessibleSummary.textContent = `${tool.cancelled}. ${tool.cancelledDetail}`;
  };

  const finishMeasurement = (): void => {
    const result = calculateDeadzoneMeasurement(samples);
    sampleStartedAt = null;
    selector.disabled = false;
    stickChoice.disabled = false;
    startButton.disabled = false;
    startButton.textContent = tool.testAgain;
    progress.textContent = '3 s';

    if (!result) {
      resetMeasurement();
      limitation.hidden = false;
      limitation.textContent = tool.cancelledDetail;
      setPresentation('cancelled', 'cancelled', tool.cancelled, tool.cancelledDetail);
      accessibleSummary.textContent = `${tool.cancelled}. ${tool.cancelledDetail}`;
      return;
    }

    const noiseText = formatCenterNoisePercent(result.centerNoise);
    const suggestionText = `~${result.suggestedPercent}%`;
    const resultSummary = formatMessage(tool.resultSummary, {
      stick: selectedStickLabel(),
      noise: (result.centerNoise * 100).toFixed(1),
      deadzone: result.suggestedPercent,
    });
    noiseResult.textContent = noiseText;
    suggestionResult.textContent = suggestionText;
    renderer.renderResult(result.centerNoise, result.suggestedDeadzone);
    limitation.hidden = true;
    setPresentation('result', 'result', tool.complete, resultSummary);
    accessibleSummary.textContent = resultSummary;
  };

  const renderSampling = (gamepad: GamepadSnapshot): void => {
    const position = getStandardStickPosition(gamepad, selectedStick);
    if (!position || sampleStartedAt === null) {
      cancelMeasurement();
      return;
    }

    samples.push(position);
    renderer.renderPosition(position);

    const elapsed = performance.now() - sampleStartedAt;
    const remainingSeconds = Math.max(0, SAMPLE_DURATION_MS - elapsed) / 1_000;
    progress.textContent = formatMessage(tool.remaining, { seconds: remainingSeconds.toFixed(1) });

    if (elapsed >= SAMPLE_DURATION_MS) {
      finishMeasurement();
    }
  };

  const renderState = (state: GamepadServiceState): void => {
    if (destroyed || state.status === 'idle') {
      return;
    }

    if (state.status === 'unsupported' || state.status === 'error') {
      if (toolState === 'sampling') {
        cancelMeasurement();
      }
      renderApiUnavailable(state.status);
      return;
    }

    if (state.gamepads.length === 0) {
      if (toolState === 'sampling') {
        cancelMeasurement();
      }
      service.setActiveGamepad(null);
      renderWaiting();
      return;
    }

    if (
      toolState === 'sampling' &&
      selectedSourceIndex !== null &&
      !state.gamepads.some((gamepad) => gamepad.sourceIndex === selectedSourceIndex)
    ) {
      cancelMeasurement();
    }

    const selected = selectFirstAvailable(state.gamepads);
    rebuildSelector(state.gamepads);

    if (toolState === 'sampling') {
      renderSampling(selected);
      return;
    }

    renderReady(selected, state.gamepads);
  };

  const handleStart = (): void => {
    if (destroyed || toolState === 'sampling') {
      return;
    }

    const state = service.getState();
    if (state.status !== 'ready') {
      return;
    }

    const selected = state.gamepads.find(
      (gamepad) => gamepad.sourceIndex === selectedSourceIndex,
    );
    if (!selected) {
      return;
    }

    const position = getStandardStickPosition(selected, selectedStick);
    if (!position) {
      renderMappingUnavailable(state.gamepads);
      return;
    }

    samples = [position];
    sampleStartedAt = performance.now();
    noiseResult.textContent = '—';
    suggestionResult.textContent = '—';
    renderer.resetResult();
    renderer.setSideLabel(selectedStickLabel());
    renderer.renderPosition(position);
    limitation.hidden = true;
    selector.disabled = true;
    stickChoice.disabled = true;
    startButton.disabled = true;
    startButton.textContent = tool.testing;
    progress.textContent = formatMessage(tool.remaining, { seconds: '3.0' });
    setPresentation('sampling', 'sampling', tool.testing, tool.connect);
    accessibleSummary.textContent = `${tool.testing}. ${tool.connect}`;
  };

  const resetForSelection = (): void => {
    resetMeasurement();
    renderer.reset();
    renderer.setSideLabel(selectedStickLabel());
    lastPresentation = null;
    toolState = 'ready';
    limitation.hidden = true;
  };

  const handleSelectorChange = (): void => {
    if (toolState === 'sampling') {
      return;
    }

    const state = service.getState();
    if (state.status !== 'ready') {
      return;
    }

    const selected = state.gamepads[selector.selectedIndex];
    if (!selected) {
      return;
    }

    selectedSourceIndex = selected.sourceIndex;
    resetForSelection();
    service.setActiveGamepad(selected.sourceIndex);
    renderReady(selected, state.gamepads);
  };

  const handleStickChange = (event: Event): void => {
    if (toolState === 'sampling') {
      return;
    }

    const input = event.currentTarget as HTMLInputElement;
    if (!input.checked || (input.value !== 'left' && input.value !== 'right')) {
      return;
    }

    selectedStick = input.value;
    resetForSelection();

    const state = service.getState();
    if (state.status !== 'ready') {
      return;
    }
    const selected = state.gamepads.find(
      (gamepad) => gamepad.sourceIndex === selectedSourceIndex,
    );
    if (selected) {
      renderReady(selected, state.gamepads);
    }
  };

  const handleVisibilityChange = (): void => {
    if (document.visibilityState !== 'visible' && toolState === 'sampling') {
      cancelMeasurement();
    }
  };

  selector.addEventListener('change', handleSelectorChange);
  stickInputs.forEach((input) => input.addEventListener('change', handleStickChange));
  startButton.addEventListener('click', handleStart);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  renderer.setSideLabel(selectedStickLabel());
  const unsubscribe = service.subscribe(renderState);
  service.start();

  return {
    start: () => {
      if (!destroyed) {
        service.start();
      }
    },
    stop: () => {
      if (destroyed) {
        return;
      }
      if (toolState === 'sampling') {
        cancelMeasurement();
      }
      service.stop();
    },
    destroy: () => {
      if (destroyed) {
        return;
      }
      destroyed = true;
      selector.removeEventListener('change', handleSelectorChange);
      stickInputs.forEach((input) => input.removeEventListener('change', handleStickChange));
      startButton.removeEventListener('click', handleStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
      service.destroy();
      renderer.reset();
    },
  };
};
