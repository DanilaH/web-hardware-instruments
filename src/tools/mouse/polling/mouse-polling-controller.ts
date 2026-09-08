import { createMouseInputService, type MousePollingSource } from '../../../browser/mouse-input-service';
import type { ToolRuntimeMessages } from '../../../i18n/runtime';
import { calculatePollingRate } from './mouse-polling-measurement';

export interface MousePollingController { stop(): void; destroy(): void; }
type Messages = ToolRuntimeMessages<'polling'>;
const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Mouse Polling Rate Test is missing ${selector}`);
  return element;
};

export const mountMousePollingTest = (root: HTMLElement, messages: Messages): MousePollingController => {
  const surface = requireElement<HTMLElement>(root, '[data-polling-surface]');
  const start = requireElement<HTMLButtonElement>(root, '[data-polling-start]');
  const status = requireElement<HTMLElement>(root, '[data-polling-status]');
  const rate = requireElement<HTMLElement>(root, '[data-polling-rate]');
  const source = requireElement<HTMLElement>(root, '[data-polling-source]');
  let service = createMouseInputService(surface, 'polling');
  let unsubscribe: () => void = () => undefined;
  let active = false;
  let destroyed = false;
  let timestamps: number[] = [];
  let timer: number | null = null;
  const sourceLabel = (value: MousePollingSource | null): string => value === 'raw-pointer' ? messages.sourceRaw : value === 'coalesced-pointer' ? messages.sourceCoalesced : value === 'basic-pointer' ? messages.sourceBasic : messages.waiting;
  const clearTimer = (): void => { if (timer !== null) { window.clearTimeout(timer); timer = null; } };
  const detach = (): void => { clearTimer(); active = false; unsubscribe(); unsubscribe = () => undefined; service.stop(); start.disabled = false; };
  const cancel = (): void => { if (!active) return; detach(); status.textContent = messages.cancelled; rate.textContent = '—'; };
  const finish = (): void => {
    if (!active) return;
    const selected = service.getPollingSource();
    const result = calculatePollingRate(timestamps);
    detach();
    source.textContent = sourceLabel(selected);
    if (!result) { status.textContent = messages.notEnough; rate.textContent = '—'; return; }
    status.textContent = messages.complete;
    rate.textContent = `${result.observedRateHz} Hz`;
  };
  const handleStart = (): void => {
    if (active || destroyed) return;
    service.destroy();
    service = createMouseInputService(surface, 'polling');
    timestamps = [];
    unsubscribe = service.subscribe((event) => {
      if (event.type === 'poll-samples' && active) timestamps.push(...event.timestamps);
      else if (event.type === 'clear' && active) cancel();
    });
    if (!service.start()) { unsubscribe(); status.textContent = messages.samplingUnavailable; source.textContent = messages.unavailable; return; }
    source.textContent = sourceLabel(service.getPollingSource());
    active = true;
    start.disabled = true;
    rate.textContent = '—';
    status.textContent = messages.measuring;
    timer = window.setTimeout(finish, 2_000);
  };
  start.addEventListener('click', handleStart);
  return {
    stop: () => { if (active) cancel(); else service.stop(); },
    destroy: () => { if (!destroyed) { destroyed = true; detach(); start.removeEventListener('click', handleStart); service.destroy(); } },
  };
};
