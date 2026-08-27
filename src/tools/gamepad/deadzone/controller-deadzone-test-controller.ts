import {
  createGamepadService,
  type GamepadServiceState,
  type GamepadSnapshot,
} from '../../../browser/gamepad-service';
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
): ControllerDeadzoneToolController => {
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
    progress.textContent = '3-second sample';
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
    stickChoice.disabled = true;
    startButton.disabled = true;
    startButton.textContent = 'Start test';
    limitation.hidden = true;
    resetMeasurement();
    renderer.reset();
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
    stickChoice.disabled = true;
    startButton.disabled = true;
    startButton.textContent = 'Start test';
    resetMeasurement();
    renderer.reset();

    const unsupported = kind === 'unsupported';
    const statusText = unsupported ? 'Gamepad API unavailable' : 'Gamepad access unavailable';
    const instructionText = unsupported
      ? 'This browser does not expose the Gamepad API.'
      : 'Gamepad access is blocked or unavailable in this browser context.';

    limitation.hidden = false;
    limitation.textContent = instructionText;
    setPresentation(kind, 'unavailable', statusText, instructionText);
    accessibleSummary.textContent = `${statusText}. ${instructionText}`;
  };

  const renderMappingUnavailable = (
    gamepads: readonly GamepadSnapshot[],
  ): void => {
    rebuildSelector(gamepads);
    stickChoice.disabled = true;
    startButton.disabled = true;
    startButton.textContent = 'Start test';
    resetMeasurement();
    renderer.reset();
    renderer.setSideLabel(selectedStick);
    limitation.hidden = false;
    limitation.textContent =
      'Deadzone measurement requires the browser standard gamepad mapping. This controller is not measured because physical stick axes would otherwise be guessed.';
    setPresentation(
      'mapping',
      'unavailable',
      'Standard mapping required',
      'Select a standard-mapped controller to measure center noise.',
    );
    accessibleSummary.textContent =
      'Controller Deadzone Test is unavailable for the selected controller because it does not expose a complete standard gamepad mapping.';
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
    if (toolState !== 'result' && toolState !== 'cancelled') {
      startButton.textContent = 'Start test';
    }
    limitation.hidden = toolState !== 'cancelled';
    renderer.setSideLabel(selectedStick);
    renderer.renderPosition(position);

    if (toolState === 'result' || toolState === 'cancelled') {
      return;
    }

    setPresentation(
      'ready',
      'ready',
      'Ready to measure',
      `Release the ${selectedStick} stick and keep it untouched.`,
    );
    accessibleSummary.textContent =
      `Controller ready. Release the ${selectedStick} stick and keep it untouched, then start the test.`;
  };

  const cancelMeasurement = (message: string): void => {
    if (toolState !== 'sampling') {
      return;
    }

    resetMeasurement();
    selector.disabled = false;
    stickChoice.disabled = false;
    startButton.disabled = false;
    startButton.textContent = 'Start again';
    limitation.hidden = false;
    limitation.textContent = message;
    setPresentation(
      'cancelled',
      'cancelled',
      'Test cancelled',
      `Release the ${selectedStick} stick and start again when the controller is ready.`,
    );
    accessibleSummary.textContent = `Controller deadzone test cancelled. ${message}`;
  };

  const finishMeasurement = (): void => {
    const result = calculateDeadzoneMeasurement(samples);
    sampleStartedAt = null;
    selector.disabled = false;
    stickChoice.disabled = false;
    startButton.disabled = false;
    startButton.textContent = 'Test again';
    progress.textContent = '3-second sample complete';

    if (!result) {
      resetMeasurement();
      limitation.hidden = false;
      limitation.textContent = 'No usable stick samples were captured. Start the test again.';
      setPresentation(
        'cancelled',
        'cancelled',
        'Test cancelled',
        'No usable stick samples were captured. Start again.',
      );
      accessibleSummary.textContent =
        'Controller deadzone test cancelled because no usable samples were captured.';
      return;
    }

    const noiseText = formatCenterNoisePercent(result.centerNoise);
    const suggestionText = `~${result.suggestedPercent}%`;
    noiseResult.textContent = noiseText;
    suggestionResult.textContent = suggestionText;
    renderer.renderResult(result.centerNoise, result.suggestedDeadzone);
    limitation.hidden = true;
    setPresentation(
      'result',
      'result',
      'Measurement complete',
      'Observed center noise and a heuristic starting deadzone are shown.',
    );
    accessibleSummary.textContent =
      `${selectedStick === 'left' ? 'Left' : 'Right'} stick measurement complete. ` +
      `Observed center noise ${noiseText}. Suggested starting deadzone approximately ${result.suggestedPercent} percent.`;
  };

  const renderSampling = (gamepad: GamepadSnapshot): void => {
    const position = getStandardStickPosition(gamepad, selectedStick);
    if (!position || sampleStartedAt === null) {
      cancelMeasurement('The selected controller can no longer provide standard stick axes.');
      return;
    }

    samples.push(position);
    renderer.renderPosition(position);

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
    renderer.setSideLabel(selectedStick);
    renderer.renderPosition(position);
    limitation.hidden = true;
    selector.disabled = true;
    stickChoice.disabled = true;
    startButton.disabled = true;
    startButton.textContent = 'Testing…';
    progress.textContent = '3.0 s remaining';
    setPresentation(
      'sampling',
      'sampling',
      'Sampling center noise',
      `Keep the ${selectedStick} stick untouched for 3 seconds.`,
    );
    accessibleSummary.textContent =
      `Controller deadzone sampling is active. Keep the ${selectedStick} stick untouched for 3 seconds.`;
  };

  const resetForSelection = (): void => {
    resetMeasurement();
    renderer.reset();
    renderer.setSideLabel(selectedStick);
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
      cancelMeasurement('The page became hidden during the sample.');
    }
  };

  selector.addEventListener('change', handleSelectorChange);
  stickInputs.forEach((input) => input.addEventListener('change', handleStickChange));
  startButton.addEventListener('click', handleStart);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  renderer.setSideLabel(selectedStick);
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
      stickInputs.forEach((input) => input.removeEventListener('change', handleStickChange));
      startButton.removeEventListener('click', handleStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
      service.destroy();
      renderer.reset();
    },
  };
};
