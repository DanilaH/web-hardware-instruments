import { createFrameSampler, type FrameSamplerEvent } from '../../../browser/frame-sampler';
import { CadenceTraceRenderer } from '../../../visuals/traces/display-trace-renderer';
import {
  createRefreshRateMeasurement,
  type RefreshRateMeasurementSnapshot,
} from './refresh-rate-measurement';

export interface DisplayToolController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const PRESENTATION_INTERVAL_MS = 250;

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Refresh Rate Test is missing ${selector}`);
  }
  return element;
};

export const mountRefreshRateTest = (root: HTMLElement): DisplayToolController => {
  const status = requireElement<HTMLElement>(root, '[data-display-status]');
  const result = requireElement<HTMLElement>(root, '[data-refresh-result]');
  const commonModeRow = requireElement<HTMLElement>(root, '[data-common-mode-row]');
  const commonMode = requireElement<HTMLElement>(root, '[data-common-mode]');
  const canvas = requireElement<HTMLCanvasElement>(root, '[data-refresh-trace]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-display-accessible-summary]');

  const sampler = createFrameSampler();
  const measurement = createRefreshRateMeasurement();
  const renderer = new CadenceTraceRenderer(canvas);

  let running = false;
  let destroyed = false;
  let lastPresentedAt: number | null = null;
  let lastStatus = '';

  const setStatus = (text: string): void => {
    root.dataset.state = text === 'Estimating live' ? 'live' : 'warming';
    if (lastStatus === text) {
      return;
    }
    status.textContent = text;
    lastStatus = text;
  };

  const renderWarming = (): void => {
    setStatus('Warming up');
    result.textContent = '—';
    commonMode.textContent = '';
    commonModeRow.hidden = true;
    accessibleSummary.textContent = 'Refresh-rate measurement is warming up.';
    renderer.clear();
  };

  const renderMeasurement = (snapshot: RefreshRateMeasurementSnapshot): void => {
    if (snapshot.phase === 'warming' || snapshot.estimatedHz === null) {
      renderWarming();
      return;
    }

    setStatus('Estimating live');
    const estimateText = `${snapshot.estimatedHz.toFixed(1)} Hz`;
    result.textContent = estimateText;

    if (snapshot.closestCommonMode === null) {
      commonMode.textContent = '';
      commonModeRow.hidden = true;
      accessibleSummary.textContent = `Estimated refresh rate ${estimateText}.`;
    } else {
      const modeText = `${snapshot.closestCommonMode} Hz`;
      commonMode.textContent = modeText;
      commonModeRow.hidden = false;
      accessibleSummary.textContent = `Estimated refresh rate ${estimateText}. Closest common mode ${modeText}.`;
    }

    renderer.render({
      intervals: snapshot.intervals,
      medianMs: snapshot.medianFrameTimeMs,
    });
  };

  const handleSamplerEvent = (event: FrameSamplerEvent): void => {
    if (destroyed || !running) {
      return;
    }

    if (event.type === 'reset') {
      measurement.reset();
      lastPresentedAt = null;
      renderWarming();
      return;
    }

    measurement.push(event.timestamp);
    if (lastPresentedAt === null || event.timestamp - lastPresentedAt >= PRESENTATION_INTERVAL_MS) {
      lastPresentedAt = event.timestamp;
      renderMeasurement(measurement.getSnapshot());
    }
  };

  const unsubscribe = sampler.subscribe(handleSamplerEvent);

  const controller: DisplayToolController = {
    start: () => {
      if (destroyed || running) {
        return;
      }

      measurement.reset();
      lastPresentedAt = null;
      renderWarming();
      running = sampler.start();

      if (!running) {
        root.dataset.state = 'unavailable';
        status.textContent = 'Frame sampling unavailable';
        accessibleSummary.textContent = 'Frame sampling is unavailable in this browser context.';
      }
    },

    stop: () => {
      if (!running) {
        return;
      }

      running = false;
      sampler.stop();
      measurement.reset();
      lastPresentedAt = null;
      renderer.clear();
    },

    destroy: () => {
      if (destroyed) {
        return;
      }

      controller.stop();
      destroyed = true;
      unsubscribe();
      sampler.destroy();
      renderer.clear();
    },
  };

  controller.start();
  return controller;
};
