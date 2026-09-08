import { createFrameSampler, type FrameSamplerEvent } from '../../../browser/frame-sampler';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';
import { CadenceTraceRenderer } from '../../../visuals/traces/display-trace-renderer';
import { createRefreshRateMeasurement, type RefreshRateMeasurementSnapshot } from './refresh-rate-measurement';

export interface DisplayToolController { start(): void; stop(): void; destroy(): void; }
type Messages = ToolRuntimeMessages<'refresh'>;
const PRESENTATION_INTERVAL_MS = 250;
const COMMON_MODE_LAYOUT_PLACEHOLDER = '480 Hz';
const requireElement = <T extends Element>(root: ParentNode, selector: string): T => { const element = root.querySelector<T>(selector); if (!element) throw new Error(`Refresh Rate Test is missing ${selector}`); return element; };

export const mountRefreshRateTest = (root: HTMLElement, messages: Messages): DisplayToolController => {
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
  const setStatus = (text: string, state: 'warming' | 'live'): void => { root.dataset.state = state; if (lastStatus !== text) { status.textContent = text; lastStatus = text; } };
  const hideCommonMode = (): void => { commonMode.textContent = COMMON_MODE_LAYOUT_PLACEHOLDER; commonModeRow.dataset.visible = 'false'; commonModeRow.setAttribute('aria-hidden', 'true'); };
  const showCommonMode = (modeText: string): void => { commonMode.textContent = modeText; commonModeRow.dataset.visible = 'true'; commonModeRow.removeAttribute('aria-hidden'); };
  const renderWarming = (): void => { setStatus(messages.warming, 'warming'); result.textContent = '—'; hideCommonMode(); accessibleSummary.textContent = messages.warmingSummary; renderer.clear(); };
  const renderMeasurement = (snapshot: RefreshRateMeasurementSnapshot): void => {
    if (snapshot.phase === 'warming' || snapshot.estimatedHz === null) { renderWarming(); return; }
    setStatus(messages.estimating, 'live');
    const estimateText = `${snapshot.estimatedHz.toFixed(1)} Hz`;
    result.textContent = estimateText;
    if (snapshot.closestCommonMode === null) { hideCommonMode(); accessibleSummary.textContent = formatMessage(messages.summary, { estimate: estimateText }); }
    else { const modeText = `${snapshot.closestCommonMode} Hz`; showCommonMode(modeText); accessibleSummary.textContent = formatMessage(messages.summaryWithMode, { estimate: estimateText, mode: modeText }); }
    renderer.render({ intervals: snapshot.intervals, medianMs: snapshot.medianFrameTimeMs });
  };
  const handleSamplerEvent = (event: FrameSamplerEvent): void => {
    if (destroyed || !running) return;
    if (event.type === 'reset') { measurement.reset(); lastPresentedAt = null; renderWarming(); return; }
    measurement.push(event.timestamp);
    if (lastPresentedAt === null || event.timestamp - lastPresentedAt >= PRESENTATION_INTERVAL_MS) { lastPresentedAt = event.timestamp; renderMeasurement(measurement.getSnapshot()); }
  };
  const unsubscribe = sampler.subscribe(handleSamplerEvent);
  const controller: DisplayToolController = {
    start: () => { if (destroyed || running) return; measurement.reset(); lastPresentedAt = null; renderWarming(); running = sampler.start(); if (!running) { root.dataset.state = 'unavailable'; status.textContent = messages.unavailable; accessibleSummary.textContent = messages.unavailableSummary; } },
    stop: () => { if (!running) return; running = false; sampler.stop(); measurement.reset(); lastPresentedAt = null; renderer.clear(); },
    destroy: () => { if (destroyed) return; controller.stop(); destroyed = true; unsubscribe(); sampler.destroy(); renderer.clear(); },
  };
  controller.start();
  return controller;
};
