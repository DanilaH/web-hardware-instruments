import { createKeyboardInputService, type KeyboardInputServiceEvent } from '../../../browser/keyboard-input-service';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';
import { clearGhostingHeld, createKeyboardGhostingObservationState, getKeyboardGhostingObservationResult, observeGhostingKeyDown, observeGhostingKeyUp, type KeyboardGhostingObservationState } from './ghosting-state';
import { formatKeyboardCode, getKeyboardGhostingPreset, type KeyboardGhostingPreset } from './ghosting-presets';

export interface KeyboardGhostingController { start(): void; stop(): void; destroy(): void; }
type Messages = ToolRuntimeMessages<'ghosting'>;
type GhostingPhase = 'idle' | 'prep' | 'observing' | 'complete' | 'interrupted';
const requireElement = <T extends Element>(root: ParentNode, selector: string): T => { const element = root.querySelector<T>(selector); if (!element) throw new Error(`Keyboard Ghosting Test is missing ${selector}`); return element; };

export const mountKeyboardGhostingTest = (root: HTMLElement, messages: Messages): KeyboardGhostingController => {
  const status = requireElement<HTMLElement>(root, '[data-ghosting-status]');
  const presetSelect = requireElement<HTMLSelectElement>(root, '[data-ghosting-preset]');
  const startButton = requireElement<HTMLButtonElement>(root, '[data-ghosting-start]');
  const result = requireElement<HTMLElement>(root, '[data-ghosting-result]');
  const detail = requireElement<HTMLElement>(root, '[data-ghosting-detail]');
  const accessibleSummary = requireElement<HTMLElement>(root, '[data-ghosting-accessible-summary]');
  const keyElements = [...root.querySelectorAll<HTMLElement>('[data-key-code]')];
  const keyElementsByCode = new Map<string, HTMLElement>();
  keyElements.forEach((element) => { const code = element.dataset.keyCode; if (code) keyElementsByCode.set(code, element); });
  const service = createKeyboardInputService();
  const heldCodes = new Set<string>();
  let phase: GhostingPhase = 'idle';
  let selectedPreset: KeyboardGhostingPreset = getKeyboardGhostingPreset(presetSelect.value);
  let observation: KeyboardGhostingObservationState | null = null;
  let prepTimer: number | null = null;
  let observationTimer: number | null = null;
  let destroyed = false;
  const clearTimers = (): void => { if (prepTimer !== null) window.clearTimeout(prepTimer); if (observationTimer !== null) window.clearTimeout(observationTimer); prepTimer = null; observationTimer = null; };
  const setPressedVisual = (code: string, pressed: boolean): void => { const element = keyElementsByCode.get(code); if (element) element.dataset.pressed = pressed ? 'true' : 'false'; };
  const clearPressedVisuals = (): void => { heldCodes.forEach((code) => setPressedVisual(code, false)); };
  const renderExpectedKeys = (): void => { keyElements.forEach((element) => { const code = element.dataset.keyCode ?? ''; element.dataset.expected = selectedPreset.codes.includes(code) ? 'true' : 'false'; element.dataset.observation = 'none'; element.dataset.additional = 'false'; }); };
  const renderCompletedSnapshot = (): void => {
    if (!observation) return;
    const observationResult = getKeyboardGhostingObservationResult(observation);
    const matchedCodes = observation.bestMatchedCodes;
    const additionalCodes = new Set(observationResult.additionalDetectedCodes);
    keyElements.forEach((element) => { const code = element.dataset.keyCode ?? ''; element.dataset.observation = selectedPreset.codes.includes(code) ? (matchedCodes.has(code) ? 'matched' : 'missed') : 'none'; element.dataset.additional = additionalCodes.has(code) ? 'true' : 'false'; });
  };
  const setControlsForRunning = (running: boolean): void => { presetSelect.disabled = running; startButton.disabled = running; };
  const interruptRun = (message: string): void => {
    if (phase !== 'prep' && phase !== 'observing') return;
    clearTimers();
    if (observation) observation = clearGhostingHeld(observation);
    phase = 'interrupted';
    root.dataset.phase = phase;
    status.textContent = messages.interruptedStatus;
    result.textContent = message;
    detail.textContent = messages.interruptedDetail;
    accessibleSummary.textContent = formatMessage(messages.interruptedSummary, { message });
    setControlsForRunning(false);
  };
  const completeObservation = (): void => {
    if (phase !== 'observing' || !observation) return;
    observationTimer = null;
    phase = 'complete';
    root.dataset.phase = phase;
    status.textContent = messages.completeStatus;
    setControlsForRunning(false);
    const observationResult = getKeyboardGhostingObservationResult(observation);
    const allDetected = observationResult.matchedCount === observationResult.expectedCount;
    result.textContent = formatMessage(allDetected ? messages.allDetected : messages.partialDetected, { expected: observationResult.expectedCount, matched: observationResult.matchedCount });
    const detailParts: string[] = [];
    if (observationResult.missingCodes.length > 0) detailParts.push(formatMessage(messages.missing, { keys: observationResult.missingCodes.map((code) => formatKeyboardCode(code, messages)).join(', ') }));
    const [onlyAdditionalCode] = observationResult.additionalDetectedCodes;
    if (observationResult.additionalDetectedCodes.length === 1 && onlyAdditionalCode) detailParts.push(formatMessage(messages.additionalOne, { key: formatKeyboardCode(onlyAdditionalCode, messages) }));
    else if (observationResult.additionalDetectedCodes.length > 1) detailParts.push(formatMessage(messages.additionalMany, { keys: observationResult.additionalDetectedCodes.map((code) => formatKeyboardCode(code, messages)).join(', ') }));
    detail.textContent = detailParts.join(' ');
    accessibleSummary.textContent = [result.textContent, detail.textContent].filter(Boolean).join(' ');
    renderCompletedSnapshot();
  };
  const beginObservation = (): void => {
    if (phase !== 'prep') return;
    prepTimer = null;
    phase = 'observing';
    root.dataset.phase = phase;
    observation = createKeyboardGhostingObservationState(selectedPreset.codes, [...heldCodes]);
    status.textContent = messages.observingStatus;
    result.textContent = messages.observingResult;
    detail.textContent = '';
    observationTimer = window.setTimeout(completeObservation, 3_000);
  };
  const handleStart = (): void => {
    if (phase === 'prep' || phase === 'observing' || destroyed) return;
    clearTimers();
    selectedPreset = getKeyboardGhostingPreset(presetSelect.value);
    observation = null;
    phase = 'prep';
    root.dataset.phase = phase;
    renderExpectedKeys();
    setControlsForRunning(true);
    root.focus({ preventScroll: true });
    status.textContent = messages.getReady;
    result.textContent = messages.getReady;
    detail.textContent = messages.getReadyDetail;
    accessibleSummary.textContent = messages.getReadySummary;
    prepTimer = window.setTimeout(beginObservation, 1_000);
  };
  const handlePresetChange = (): void => {
    if (phase === 'prep' || phase === 'observing') return;
    selectedPreset = getKeyboardGhostingPreset(presetSelect.value);
    phase = 'idle';
    root.dataset.phase = phase;
    observation = null;
    result.textContent = messages.restartResult;
    detail.textContent = '';
    status.textContent = messages.ready;
    renderExpectedKeys();
  };
  const handleEvent = (event: KeyboardInputServiceEvent): void => {
    if (destroyed) return;
    if (event.type === 'clear') {
      clearPressedVisuals(); heldCodes.clear(); if (observation) observation = clearGhostingHeld(observation);
      if (phase === 'prep' || phase === 'observing') interruptRun(messages.testInterrupted);
      return;
    }
    if (event.type === 'keyup') { if (!event.code) return; heldCodes.delete(event.code); setPressedVisual(event.code, false); if (phase === 'observing' && observation) observation = observeGhostingKeyUp(observation, event.code); return; }
    if (!event.code) return;
    heldCodes.add(event.code); setPressedVisual(event.code, true); if (phase === 'observing' && observation) observation = observeGhostingKeyDown(observation, event.code);
  };
  startButton.addEventListener('click', handleStart);
  presetSelect.addEventListener('change', handlePresetChange);
  renderExpectedKeys();
  const unsubscribe = service.subscribe(handleEvent);
  const started = service.start();
  if (!started) { root.dataset.state = 'unavailable'; status.textContent = messages.unavailable; result.textContent = messages.unavailableResult; startButton.disabled = true; presetSelect.disabled = true; accessibleSummary.textContent = messages.unavailableSummary; }
  return {
    start: () => { if (!destroyed && service.start()) { root.dataset.state = 'ready'; if (phase === 'interrupted') status.textContent = messages.readyAgain; if (phase !== 'prep' && phase !== 'observing') setControlsForRunning(false); } },
    stop: () => { if (!destroyed) { interruptRun(messages.testInterrupted); clearPressedVisuals(); heldCodes.clear(); if (observation) observation = clearGhostingHeld(observation); service.stop(); } },
    destroy: () => { if (!destroyed) { destroyed = true; clearTimers(); clearPressedVisuals(); heldCodes.clear(); startButton.removeEventListener('click', handleStart); presetSelect.removeEventListener('change', handlePresetChange); unsubscribe(); service.destroy(); } },
  };
};
