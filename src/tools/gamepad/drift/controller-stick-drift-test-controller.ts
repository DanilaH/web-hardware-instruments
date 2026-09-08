import {
  createGamepadService,
  type GamepadServiceState,
  type GamepadSnapshot,
} from '../../../browser/gamepad-service';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';
import { StickDriftPlotRenderer } from '../../../visuals/controller/stick-drift-plot-renderer';
import { getStandardStickPositions } from '../gamepad-stick-adapter';
import type { StickPosition } from '../stick-position';
import {
  calculateControllerDrift,
  formatCenterOffsetPercent,
} from './stick-drift-measurement';

export interface ControllerStickDriftToolController {
  start(): void;
  stop(): void;
  destroy(): void;
}

export interface ControllerStickDriftMessages {
  common: ToolRuntimeMessages<'gamepadTester'>;
  tool: ToolRuntimeMessages<'stickDrift'>;
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
    throw new Error(`Controller Stick Drift Test is missing ${selector}`);
  }
  return element;
};

export const mountControllerStickDriftTest = (
  root: HTMLElement,
  messages: ControllerStickDriftMessages,
): ControllerStickDriftToolController => {
  const { common, tool } = messages;
  const status = requireElement<HTMLElement>(root, '[data-drift-status]');
  const instruction = requireElement<HTMLElement>(root, '[data-drift-instruction]');
  const statusLive = requireElement<HTMLElement>(root, '[data-drift-status-live]');
  const selectorWrap = requireElement<HTMLElement>(root, '[data-drift-selector-wrap]');
  const selector = requireElement<HTMLSelectElement>(root, '[data-drift-selector]');
  const startButton = requireElement<HTMLButtonElement>(root, '[data-drift-start]');
  const progress = requireElement<HTMLElement>(root, '[data-drift-progress]');
  const resultLeft = requireElement<HTMLElement>(root, '[data-drift-result-left]');
  const resultRight = requireElement<HTMLElement>(root, '[data-drift-result-right]');
  const limitation = requireElement<HTMLElement>(root, '[data-drift-limitation]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-drift-accessible-summary]');
  const leftPlotRoot = requireElement<HTMLElement>(root, '[data-stick-drift-plot="left"]');
  const rightPlotRoot = requireElement<HTMLElement>(root, '[data-stick-drift-plot="right"]');

  const service = createGamepadService();
  const leftRenderer = new StickDriftPlotRenderer(leftPlotRoot);
  const rightRenderer = new StickDriftPlotRenderer(rightPlotRoot);

  let destroyed = false;
  let toolState: ToolState = 'waiting';
  let selectedSourceIndex: number | null = null;
  let lastControllerListSignature = '';
  let lastPresentation: PresentationKey | null = null;
  let sampleStartedAt: number | null = null;
  let leftSamples: StickPosition[] = [];
  let rightSamples: StickPosition[] = [];

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

  const clearMeasurement = (): void => {
    sampleStartedAt = null;
    leftSamples = [];
    rightSamples = [];
    resultLeft.textContent = '—';
    resultRight.textContent = '—';
    progress.textContent = '3 s';
    leftRenderer.reset();
    rightRenderer.reset();
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
    startButton.disabled = true;
    startButton.textContent = tool.start;
    limitation.hidden = true;
    clearMeasurement();
    setPresentation('waiting', 'waiting', common.noController, common.connectInstruction);
    accessibleSummary.textContent = `${common.noController}. ${common.connectInstruction}`;
  };

  const renderApiUnavailable = (kind: 'unsupported' | 'error'): void => {
    selectedSourceIndex = null;
    service.setActiveGamepad(null);
    selectorWrap.hidden = true;
    startButton.disabled = true;
    startButton.textContent = tool.start;
    limitation.hidden = false;
    clearMeasurement();

    const unsupported = kind === 'unsupported';
    const statusText = unsupported ? common.apiUnavailable : common.accessUnavailable;
    const instructionText = unsupported
      ? common.apiUnavailableInstruction
      : common.accessUnavailableInstruction;

    limitation.textContent = instructionText;
    setPresentation(kind, 'unavailable', statusText, instructionText);
    accessibleSummary.textContent = `${statusText}. ${instructionText}`;
  };

  const renderMappingUnavailable = (
    gamepad: GamepadSnapshot,
    gamepads: readonly GamepadSnapshot[],
  ): void => {
    rebuildSelector(gamepads);
    startButton.disabled = true;
    startButton.textContent = tool.start;
    limitation.hidden = false;
    limitation.textContent = tool.unavailableDetail;
    clearMeasurement();
    setPresentation('mapping', 'unavailable', tool.unavailable, tool.unavailableDetail);
    accessibleSummary.textContent = `${tool.unavailable}. ${tool.unavailableDetail}`;

    const positions = getStandardStickPositions(gamepad);
    if (positions) {
      leftRenderer.render(positions.left, false);
      rightRenderer.render(positions.right, false);
    }
  };

  const renderReady = (gamepad: GamepadSnapshot, gamepads: readonly GamepadSnapshot[]): void => {
    const positions = getStandardStickPositions(gamepad);
    if (!positions) {
      renderMappingUnavailable(gamepad, gamepads);
      return;
    }

    rebuildSelector(gamepads);
    selector.disabled = false;
    startButton.disabled = false;
    startButton.textContent = toolState === 'result' ? tool.testAgain : tool.start;
    limitation.hidden = toolState !== 'cancelled';
    leftRenderer.render(positions.left, false);
    rightRenderer.render(positions.right, false);

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

    clearMeasurement();
    selector.disabled = false;
    startButton.disabled = false;
    startButton.textContent = tool.start;
    limitation.hidden = false;
    limitation.textContent = tool.cancelledDetail;
    setPresentation('cancelled', 'cancelled', tool.cancelled, tool.cancelledDetail);
    accessibleSummary.textContent = `${tool.cancelled}. ${tool.cancelledDetail}`;
  };

  const finishMeasurement = (): void => {
    const result = calculateControllerDrift(leftSamples, rightSamples);
    sampleStartedAt = null;
    selector.disabled = false;
    startButton.disabled = false;
    startButton.textContent = tool.testAgain;
    progress.textContent = '3 s';

    if (!result) {
      clearMeasurement();
      limitation.hidden = false;
      limitation.textContent = tool.cancelledDetail;
      setPresentation('cancelled', 'cancelled', tool.cancelled, tool.cancelledDetail);
      accessibleSummary.textContent = `${tool.cancelled}. ${tool.cancelledDetail}`;
      return;
    }

    const leftText = formatCenterOffsetPercent(result.left.centerOffset);
    const rightText = formatCenterOffsetPercent(result.right.centerOffset);
    const resultSummary = formatMessage(tool.resultSummary, {
      left: (result.left.centerOffset * 100).toFixed(1),
      right: (result.right.centerOffset * 100).toFixed(1),
    });
    resultLeft.textContent = leftText;
    resultRight.textContent = rightText;
    limitation.hidden = true;
    setPresentation('result', 'result', tool.complete, resultSummary);
    accessibleSummary.textContent = resultSummary;
  };

  const renderSampling = (gamepad: GamepadSnapshot): void => {
    const positions = getStandardStickPositions(gamepad);
    if (!positions || sampleStartedAt === null) {
      cancelMeasurement();
      return;
    }

    leftSamples.push(positions.left);
    rightSamples.push(positions.right);
    leftRenderer.render(positions.left, true);
    rightRenderer.render(positions.right, true);

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

    const positions = getStandardStickPositions(selected);
    if (!positions) {
      renderMappingUnavailable(selected, state.gamepads);
      return;
    }

    leftSamples = [positions.left];
    rightSamples = [positions.right];
    sampleStartedAt = performance.now();
    resultLeft.textContent = '—';
    resultRight.textContent = '—';
    limitation.hidden = true;
    leftRenderer.reset();
    rightRenderer.reset();
    leftRenderer.render(positions.left, true);
    rightRenderer.render(positions.right, true);
    selector.disabled = true;
    startButton.disabled = true;
    startButton.textContent = tool.testing;
    progress.textContent = formatMessage(tool.remaining, { seconds: '3.0' });
    setPresentation('sampling', 'sampling', tool.testing, tool.connect);
    accessibleSummary.textContent = `${tool.testing}. ${tool.connect}`;
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
    clearMeasurement();
    lastPresentation = null;
    toolState = 'ready';
    service.setActiveGamepad(selected.sourceIndex);
    renderReady(selected, state.gamepads);
  };

  const handleVisibilityChange = (): void => {
    if (document.visibilityState !== 'visible' && toolState === 'sampling') {
      cancelMeasurement();
    }
  };

  selector.addEventListener('change', handleSelectorChange);
  startButton.addEventListener('click', handleStart);
  document.addEventListener('visibilitychange', handleVisibilityChange);
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
      startButton.removeEventListener('click', handleStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
      service.destroy();
      leftRenderer.reset();
      rightRenderer.reset();
    },
  };
};
