import {
  createMouseMovementService,
  type MouseCaptureMode,
  type MouseMovementServiceEvent,
} from '../../../browser/mouse-movement-service';
import { MouseMovementGuideRenderer } from '../../../visuals/mouse/mouse-movement-guide-renderer';
import {
  calculateEstimatedDpi,
  convertDistance,
  distanceToInches,
  type DistanceUnit,
} from './mouse-dpi-measurement';

export interface MouseDpiToolController {
  stop(): void;
  destroy(): void;
}

type ToolState = 'ready' | 'starting' | 'active' | 'result' | 'cancelled' | 'error';

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Mouse DPI Test is missing ${selector}`);
  }
  return element;
};

const formatDistance = (value: number): string => {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return rounded.toString();
};

const captureModeNote = (mode: MouseCaptureMode): string => {
  if (mode === 'raw-pointer-lock') {
    return 'Raw pointer input is active. Press Escape to cancel.';
  }
  if (mode === 'pointer-lock') {
    return 'Pointer Lock is active. OS acceleration may affect the estimate. Press Escape to cancel.';
  }
  return 'Browser movement fallback is active. Acceleration and screen edges may affect the estimate. Press Escape to cancel.';
};

const completedCaptureModeNote = (mode: MouseCaptureMode | null): string => {
  if (mode === 'raw-pointer-lock') {
    return 'This measurement used raw pointer input.';
  }
  if (mode === 'pointer-lock') {
    return 'This measurement used Pointer Lock; OS acceleration may affect the estimate.';
  }
  if (mode === 'unlocked') {
    return 'This measurement used browser movement fallback; acceleration and screen edges may affect the estimate.';
  }
  return 'The result uses only movement recorded during the active measurement.';
};

export const mountMouseDpiTest = (root: HTMLElement): MouseDpiToolController => {
  const form = requireElement<HTMLFormElement>(root, '[data-mouse-dpi-form]');
  const distanceInput = requireElement<HTMLInputElement>(root, '[data-distance]');
  const unitSelect = requireElement<HTMLSelectElement>(root, '[data-distance-unit]');
  const startButton = requireElement<HTMLButtonElement>(root, '[data-start]');
  const status = requireElement<HTMLElement>(root, '[data-mouse-status]');
  const instruction = requireElement<HTMLElement>(root, '[data-mouse-instruction]');
  const captureNote = requireElement<HTMLElement>(root, '[data-capture-note]');
  const result = requireElement<HTMLElement>(root, '[data-dpi-result]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-mouse-accessible-summary]');
  const guideRoot = requireElement<HTMLElement>(root, '[data-mouse-movement-guide]');

  const service = createMouseMovementService();
  const renderer = new MouseMovementGuideRenderer(guideRoot);

  let destroyed = false;
  let state: ToolState = 'ready';
  let currentUnit: DistanceUnit = unitSelect.value === 'in' ? 'in' : 'cm';
  let physicalDistanceInches = distanceToInches(Number(distanceInput.value), currentUnit);
  let signedHorizontalUnits = 0;
  let activeCaptureMode: MouseCaptureMode | null = null;
  let sessionVersion = 0;
  let finishClickHandler: ((event: MouseEvent) => void) | null = null;

  const setState = (nextState: ToolState, statusText: string): void => {
    state = nextState;
    root.dataset.state = nextState;
    status.textContent = statusText;
  };

  const setControlsDisabled = (disabled: boolean): void => {
    distanceInput.disabled = disabled;
    unitSelect.disabled = disabled;
    startButton.disabled = disabled;
  };

  const clearFinishClick = (): void => {
    if (!finishClickHandler) {
      return;
    }
    document.removeEventListener('click', finishClickHandler, true);
    finishClickHandler = null;
  };

  const renderReady = (statusText = 'Ready'): void => {
    setState('ready', statusText);
    setControlsDisabled(false);
    startButton.textContent = 'Start test';
    instruction.textContent = 'Set the physical distance, then start the measurement.';
    captureNote.textContent = 'Raw Pointer Lock is preferred; the tool falls back when it is unavailable.';
    result.textContent = '—';
    signedHorizontalUnits = 0;
    activeCaptureMode = null;
    renderer.reset();
    accessibleSummary.textContent = 'Mouse DPI Test is ready. Set a distance and start the measurement.';
  };

  const cancelMeasurement = (message: string): void => {
    sessionVersion += 1;
    clearFinishClick();
    service.stop();
    signedHorizontalUnits = 0;
    activeCaptureMode = null;
    renderer.reset();
    setControlsDisabled(false);
    startButton.textContent = 'Start test';
    result.textContent = '—';
    instruction.textContent = 'The measurement was cancelled. Start again when you are ready.';
    captureNote.textContent = message;
    setState('cancelled', 'Measurement cancelled');
    accessibleSummary.textContent = `Mouse DPI measurement cancelled. ${message}`;
  };

  const finishMeasurement = (): void => {
    if (state !== 'active') {
      return;
    }

    clearFinishClick();
    const completedMode = activeCaptureMode;
    activeCaptureMode = null;
    service.stop();
    setControlsDisabled(false);

    const estimate =
      physicalDistanceInches === null
        ? null
        : calculateEstimatedDpi(signedHorizontalUnits, physicalDistanceInches, 'in');
    renderer.render({ horizontalUnits: signedHorizontalUnits });

    if (estimate === null) {
      result.textContent = '—';
      startButton.textContent = 'Try again';
      instruction.textContent = 'No usable horizontal movement was captured. Start again and move horizontally.';
      captureNote.textContent = 'The estimate needs a non-zero horizontal movement sample.';
      setState('error', 'No horizontal movement captured');
      accessibleSummary.textContent = 'No usable horizontal movement was captured. Try the measurement again.';
      return;
    }

    const dpiText = Math.round(estimate).toString();
    result.textContent = dpiText;
    startButton.textContent = 'Measure again';
    instruction.textContent = 'Measurement complete. Repeat the same physical distance if you want another estimate.';
    captureNote.textContent = completedCaptureModeNote(completedMode);
    setState('result', 'Estimate ready');
    accessibleSummary.textContent = `Estimated DPI ${dpiText}. ${completedCaptureModeNote(completedMode)}`;
  };

  const armFinishClick = (): void => {
    clearFinishClick();
    finishClickHandler = (event) => {
      if (state !== 'active' || event.button !== 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      finishMeasurement();
    };
    document.addEventListener('click', finishClickHandler, true);
  };

  const handleServiceEvent = (event: MouseMovementServiceEvent): void => {
    if (destroyed || state !== 'active') {
      return;
    }

    if (event.type === 'cancel') {
      const reasonText =
        event.reason === 'escape'
          ? 'Escape ended the capture.'
          : event.reason === 'visibility-hidden'
            ? 'The page became hidden, so the capture was reset.'
            : event.reason === 'blur'
              ? 'The page lost focus, so the capture was reset.'
              : 'Pointer Lock ended before the measurement was finished.';
      cancelMeasurement(reasonText);
      return;
    }

    signedHorizontalUnits += event.movementX;
    renderer.render({ horizontalUnits: signedHorizontalUnits });
  };

  const unsubscribe = service.subscribe(handleServiceEvent);

  const handleDistanceInput = (): void => {
    distanceInput.setCustomValidity('');
    const value = Number(distanceInput.value);
    physicalDistanceInches = distanceToInches(value, currentUnit);
  };

  const handleUnitChange = (): void => {
    const nextUnit: DistanceUnit = unitSelect.value === 'in' ? 'in' : 'cm';
    if (nextUnit === currentUnit) {
      return;
    }

    if (physicalDistanceInches !== null) {
      const converted = convertDistance(physicalDistanceInches, 'in', nextUnit);
      if (converted !== null) {
        distanceInput.value = formatDistance(converted);
      }
    }

    currentUnit = nextUnit;
  };

  const handleSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    if (destroyed || state === 'starting' || state === 'active') {
      return;
    }

    const distance = Number(distanceInput.value);
    physicalDistanceInches = distanceToInches(distance, currentUnit);
    if (physicalDistanceInches === null) {
      distanceInput.setCustomValidity('Enter a distance greater than zero.');
      distanceInput.reportValidity();
      return;
    }
    distanceInput.setCustomValidity('');

    const version = ++sessionVersion;
    signedHorizontalUnits = 0;
    activeCaptureMode = null;
    renderer.reset();
    result.textContent = '—';
    setControlsDisabled(true);
    startButton.textContent = 'Capturing…';
    setState('starting', 'Starting capture');
    instruction.textContent = 'Allow pointer capture if your browser requests it.';
    captureNote.textContent = 'Preparing the best available movement capture mode…';
    accessibleSummary.textContent = 'Starting mouse movement capture.';

    const mode = await service.start(guideRoot);
    if (destroyed || version !== sessionVersion) {
      return;
    }

    if (mode === null) {
      setControlsDisabled(false);
      startButton.textContent = 'Try again';
      setState('error', 'Mouse capture unavailable');
      instruction.textContent = 'This browser context could not start mouse movement capture.';
      captureNote.textContent = 'Try another desktop browser or context.';
      accessibleSummary.textContent = 'Mouse movement capture is unavailable in this browser context.';
      return;
    }

    activeCaptureMode = mode;
    const distanceText = distanceInput.value;
    setState('active', 'Capture active');
    instruction.textContent = `Move your mouse horizontally exactly ${distanceText} ${currentUnit}, then click once to finish.`;
    captureNote.textContent = captureModeNote(mode);
    accessibleSummary.textContent = `Mouse movement capture is active. Move horizontally exactly ${distanceText} ${currentUnit}, then click once to finish.`;
    armFinishClick();
  };

  distanceInput.addEventListener('input', handleDistanceInput);
  unitSelect.addEventListener('change', handleUnitChange);
  form.addEventListener('submit', handleSubmit);
  renderer.reset();
  renderReady();

  const controller: MouseDpiToolController = {
    stop: () => {
      sessionVersion += 1;
      clearFinishClick();
      service.stop();
      if (!destroyed) {
        renderReady();
      }
    },
    destroy: () => {
      if (destroyed) {
        return;
      }
      controller.stop();
      destroyed = true;
      distanceInput.removeEventListener('input', handleDistanceInput);
      unitSelect.removeEventListener('change', handleUnitChange);
      form.removeEventListener('submit', handleSubmit);
      unsubscribe();
      service.destroy();
      renderer.reset();
    },
  };

  return controller;
};
