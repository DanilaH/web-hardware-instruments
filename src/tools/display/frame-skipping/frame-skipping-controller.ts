import { createFrameSampler, type FrameSamplerEvent } from '../../../browser/frame-sampler';
import { FrameSkippingRenderer } from '../../../visuals/display/frame-skipping-renderer';
import {
  createFrameSkippingReadinessState,
  frameSkippingSlotCount,
  getFrameSkippingReadinessSnapshot,
  pushFrameSkippingSample,
  type FrameSkippingReadinessSnapshot,
  type FrameSkippingReadinessState,
} from './frame-skipping-readiness';

export interface FrameSkippingController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Frame Skipping Test is missing ${selector}`);
  return element;
};

export const mountFrameSkippingTest = (root: HTMLElement): FrameSkippingController => {
  const status = requireElement<HTMLElement>(root, '[data-frame-skipping-status]');
  const canvas = requireElement<HTMLCanvasElement>(root, '[data-frame-skipping-canvas]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-frame-skipping-accessible-summary]');

  const sampler = createFrameSampler();
  const renderer = new FrameSkippingRenderer(canvas);
  let readiness: FrameSkippingReadinessState = createFrameSkippingReadinessState();
  let running = false;
  let destroyed = false;
  let lastPhase: FrameSkippingReadinessSnapshot['phase'] | null = null;

  const renderPhase = (snapshot: FrameSkippingReadinessSnapshot): void => {
    if (snapshot.phase === lastPhase) return;
    lastPhase = snapshot.phase;
    root.dataset.state = snapshot.phase;

    if (snapshot.phase === 'ready') {
      status.textContent = 'READY — take the photo now.';
      accessibleSummary.textContent = 'Frame Skipping pattern is ready. Take the camera photo now.';
      return;
    }

    if (snapshot.phase === 'waiting') {
      status.textContent = 'Browser timing unstable — close heavy tabs/apps and wait.';
      accessibleSummary.textContent = 'Browser timing is unstable. Wait before taking a photo.';
      return;
    }

    status.textContent = 'Warming up browser timing…';
    accessibleSummary.textContent = 'Frame Skipping pattern is warming up browser timing.';
  };

  const resetReadiness = (): void => {
    readiness = createFrameSkippingReadinessState();
    lastPhase = null;
    renderer.clear();
    renderPhase(getFrameSkippingReadinessSnapshot(readiness));
  };

  const handleSamplerEvent = (event: FrameSamplerEvent): void => {
    if (destroyed || !running) return;

    if (event.type === 'reset') {
      resetReadiness();
      return;
    }

    const previousReady = readiness.ready;
    const previousOrdinal = readiness.frameOrdinal;
    readiness = pushFrameSkippingSample(readiness, event.timestamp);
    const snapshot = getFrameSkippingReadinessSnapshot(readiness);

    if (snapshot.ready && snapshot.frameOrdinal !== previousOrdinal) {
      renderer.render({ slot: snapshot.slot, slotCount: frameSkippingSlotCount });
    } else if (previousReady && !snapshot.ready) {
      renderer.clear();
    }

    renderPhase(snapshot);
  };

  const unsubscribe = sampler.subscribe(handleSamplerEvent);

  const controller: FrameSkippingController = {
    start: () => {
      if (destroyed || running) return;
      resetReadiness();
      running = sampler.start();
      if (!running) {
        root.dataset.state = 'unavailable';
        status.textContent = 'Frame sampling unavailable in this browser.';
        accessibleSummary.textContent = 'Frame sampling is unavailable in this browser context.';
      }
    },
    stop: () => {
      if (!running) return;
      running = false;
      sampler.stop();
      resetReadiness();
    },
    destroy: () => {
      if (destroyed) return;
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
