import {
  createGamepadService,
  type GamepadServiceState,
  type GamepadSnapshot,
} from '../../../browser/gamepad-service';
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
): ControllerStickDriftToolController => {
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
    progress.textContent = '3-second sample';
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
          option.textContent = `Controller ${index + 1}`;
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
    startButton.textContent = 'Start test';
    limitation.hidden = true;
    clearMeasurement();
    setPresentation(
      'waiting',
      'waiting',
      'No controller detected',
      'Connect a controller and press any button.',
    );
    accessibleSummary.textContent = 'No controller detected. Connect a controller and press any button.';
  };

  const renderApiUnavailable = (kind: 'unsupported' | 'error'): void => {
    selectedSourceIndex = null;
    service.setActiveGamepad(null);
    selectorWrap.hidden = true;
    startButton.disabled = true;
    startButton.textContent = 'Start test';
    limitation.hidden = false;
    clearMeasurement();

    const unsupported = kind === 'unsupported';
    const statusText = unsupported ? 'Gamepad API unavailable' : 'Gamepad access unavailable';
    const instructionText = unsupported
      ? 'This browser does not expose the Gamepad API.'
      : 'Gamepad access is blocked or unavailable in this browser context.';

    limitation.textContent = instructionText;
    setPresentation(kind, 'unavailable', statusText, instructionText);
    accessibleSummary.textContent = `${statusText}. ${instructionText}`;
  };

  const renderMappingUnavailable = (gamepad: GamepadSnapshot, gamepads: readonly GamepadSnapshot[]): void => {
    rebuildSelector(gamepads);
    startButton.disabled = true;
    startButton.textContent = 'Start test';
    limitation.hidden = false;
    limitation.textContent =
      'Stick Drift requires the browser standard gamepad mapping. This controller is not measured because physical stick axes would otherwise be guessed.';
    clearMeasurement();
    setPresentation(
      'mapping',
      'unavailable',
      'Standard mapping required',
      'Select a standard-mapped controller to run the stick drift test.',
    );
    accessibleSummary.textContent =
      'Stick Drift is unavailable for the selected controller because it does not expose a complete standard gamepad mapping.';

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
    startButton.textContent = toolState === 'result' ? 'Test again' : 'Start test';
    limitation.hidden = true;
    leftRenderer.render(positions.left, false);
    rightRenderer.render(positions.right, false);

    if (toolState === 'result' || toolState === 'cancelled') {
      return;
    }

    setPresentation(
      'ready',
      'ready',
      'Ready to test',
      'Release both sticks and keep them untouched.',
    );
    accessibleSummary.textContent =
      'Controller ready. Release both sticks and keep them untouched, then start the test.';
  };

  const cancelMeasurement = (message: string): void => {
    if (toolState !== 'sampling') {
      return;
    }

    clearMeasurement();
    selector.disabled = false;
    startButton.disabled = false;
    startButton.textContent = 'Start again';
    limitation.hidden = false;
    limitation.textContent = message;
    setPresentation(
      'cancelled',
      'cancelled',
      'Test cancelled',
      'Release both sticks and start again when the controller is ready.',
    );
    accessibleSummary.textContent = `Stick drift test cancelled. ${message}`;
  };

  const finishMeasurement = (): void => {
    const result = calculateControllerDrift(leftSamples, rightSamples);
    sampleStartedAt = null;
    selector.disabled = false;
    startButton.disabled = false;
    startButton.textContent = 'Test again';
    progress.textContent = '3-second sample complete';

    if (!result) {
      clearMeasurement();
      limitation.hidden = false;
      limitation.textContent = 'No usable stick samples were captured. Start the test again.';
      setPresentation(
        'cancelled',
        'cancelled',
        'Test cancelled',
        'No usable stick samples were captured. Start again.',
      );
      accessibleSummary.textContent = 'Stick drift test cancelled because no usable samples were captured.';
      return;
    }

    const leftText = formatCenterOffsetPercent(result.left.centerOffset);
    const rightText = formatCenterOffsetPercent(result.right.centerOffset);
    resultLeft.textContent = leftText;
    resultRight.textContent = rightText;
    limitation.hidden = true;
    setPresentation(
      'result',
      'result',
      'Measurement complete',
      'Observed center offset is shown for each stick.',
    );
    accessibleSummary.textContent =
      `Stick drift measurement complete. Left stick observed center offset ${leftText}. ` +
      `Right stick observed center offset ${rightText}.`;
  };

  const renderSampling = (gamepad: GamepadSnapshot): void => {
    const positions = getStandardStickPositions(gamepad);
    if (!positions || sampleStartedAt === null) {
      cancelMeasurement('The selected controller can no longer provide standard stick axes.');
      return;
    }

    leftSamples.push(positions.left);
    rightSamples.push(positions.right);
    leftRenderer.render(positions.left, true);
    rightRenderer.render(positions.right, true);

    const elapsed = performance.now() - sampleStartedAt;
    const remainingSeconds = Math.max(0, SAMPLE_DURATION_MS - elapsed) / 1_000;
    progress.textContent = `${remainingSeconds.toFixed(1)} s remaining`;

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
        cancelMeasurement('Gamepad access became unavailable during the sample.');
      }
      renderApiUnavailable(state.status);
      return;
    }

    if (state.gamepads.length === 0) {
      if (toolState === 'sampling') {
        cancelMeasurement('The controller disconnected during the sample.');
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
      cancelMeasurement('The selected controller disconnected during the sample.');
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
    startButton.textContent = 'Testing…';
    progress.textContent = '3.0 s remaining';
    setPresentation(
      'sampling',
      'sampling',
      'Sampling stick centers',
      'Keep both sticks untouched for 3 seconds.',
    );
    accessibleSummary.textContent = 'Stick drift sampling is active. Keep both sticks untouched for 3 seconds.';
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
      cancelMeasurement('The page became hidden during the sample.');
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
        cancelMeasurement('The measurement was stopped before the sample completed.');
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
