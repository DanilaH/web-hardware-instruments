import { createFrameSampler, type FrameSamplerEvent } from '../../../browser/frame-sampler';
import { FpsTraceRenderer } from '../../../visuals/traces/display-trace-renderer';
import { createFpsMeasurement, type FpsMeasurementSnapshot } from './fps-measurement';

export interface DisplayToolController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const PRESENTATION_INTERVAL_MS = 250;

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`FPS Test is missing ${selector}`);
  }
  return element;
};

const formatFps = (value: number | null): string =>
  value === null || !Number.isFinite(value) ? '—' : value.toFixed(1);

export const mountFpsTest = (root: HTMLElement): DisplayToolController => {
  const status = requireElement<HTMLElement>(root, '[data-display-status]');
  const result = requireElement<HTMLElement>(root, '[data-fps-result]');
  const low = requireElement<HTMLElement>(root, '[data-fps-low]');
  const high = requireElement<HTMLElement>(root, '[data-fps-high]');
  const frameTime = requireElement<HTMLElement>(root, '[data-frame-time]');
  const canvas = requireElement<HTMLCanvasElement>(root, '[data-fps-trace]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-display-accessible-summary]');

  const sampler = createFrameSampler();
  const measurement = createFpsMeasurement();
  const renderer = new FpsTraceRenderer(canvas);

  let running = false;
  let destroyed = false;
  let lastPresentedAt: number | null = null;
  let lastStatus = '';

  const setStatus = (text: string): void => {
    root.dataset.state = text === 'Measuring live' ? 'live' : 'warming';
    if (lastStatus === text) {
      return;
    }
    status.textContent = text;
    lastStatus = text;
  };

  const renderWarming = (): void => {
    setStatus('Warming up');
    result.textContent = '—';
    low.textContent = '—';
    high.textContent = '—';
    frameTime.textContent = '—';
    accessibleSummary.textContent = 'FPS measurement is warming up.';
    renderer.clear();
  };

  const renderMeasurement = (snapshot: FpsMeasurementSnapshot): void => {
    if (snapshot.phase === 'warming' || snapshot.fps === null) {
      renderWarming();
      return;
    }

    setStatus('Measuring live');
    const fpsText = formatFps(snapshot.fps);
    const traceValues = snapshot.trace.map((point) => point.value).filter(Number.isFinite);
    const lowValue = traceValues.length > 0 ? Math.min(...traceValues) : snapshot.fps;
    const highValue = traceValues.length > 0 ? Math.max(...traceValues) : snapshot.fps;
    const lowText = formatFps(lowValue);
    const highText = formatFps(highValue);
    const frameTimeText =
      snapshot.medianFrameTimeMs === null ? '—' : `${snapshot.medianFrameTimeMs.toFixed(1)} ms`;

    result.textContent = fpsText;
    low.textContent = lowText;
    high.textContent = highText;
    frameTime.textContent = frameTimeText;
    accessibleSummary.textContent =
      `Current FPS ${fpsText} using a one-second rolling window. ` +
      `Recent low ${lowText}, recent high ${highText}. Median frame time ${frameTimeText}.`;
    renderer.render({ points: snapshot.trace });
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
