import { createMouseMovementService, type MouseCaptureMode, type MouseMovementServiceEvent } from '../../../browser/mouse-movement-service';
import { formatMessage, type ToolRuntimeMessages } from '../../../i18n/runtime';
import { MouseMovementGuideRenderer } from '../../../visuals/mouse/mouse-movement-guide-renderer';
import { calculateEstimatedDpi, convertDistance, distanceToInches, type DistanceUnit } from './mouse-dpi-measurement';

export interface MouseDpiToolController { stop(): void; destroy(): void; }
type Messages = ToolRuntimeMessages<'dpi'>;
type ToolState = 'ready' | 'starting' | 'active' | 'result' | 'cancelled' | 'error';
const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Mouse DPI Test is missing ${selector}`);
  return element;
};
const formatInputDistance = (value: number): string => (Math.round(value * 1_000_000) / 1_000_000).toString();

export const mountMouseDpiTest = (root: HTMLElement, messages: Messages): MouseDpiToolController => {
  const form = requireElement<HTMLFormElement>(root, '[data-mouse-dpi-form]');
  const distanceInput = requireElement<HTMLInputElement>(root, '[data-distance]');
  const unitSelect = requireElement<HTMLSelectElement>(root, '[data-distance-unit]');
  const startButton = requireElement<HTMLButtonElement>(root, '[data-start]');
  const status = requireElement<HTMLElement>(root, '[data-mouse-status]');
  const instruction = requireElement<HTMLElement>(root, '[data-mouse-instruction]');
  const captureNote = requireElement<HTMLElement>(root, '[data-capture-note]');
  const result = requireElement<HTMLElement>(root, '[data-dpi-result]');
  const captureQuality = requireElement<HTMLElement>(root, '[data-capture-quality]');
  const capturedUnits = requireElement<HTMLElement>(root, '[data-captured-units]');
  const capturedDistance = requireElement<HTMLElement>(root, '[data-captured-distance]');
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

  const formatNumber = (value: number, maximumFractionDigits: number): string => value.toLocaleString(messages.numberLocale, { maximumFractionDigits });
  const formatCapturedUnits = (value: number): string => formatNumber(Math.round(Math.abs(value) * 10) / 10, 1);
  const captureModeLabel = (mode: MouseCaptureMode | null): string => mode === 'raw-pointer-lock' ? messages.rawInput : mode === 'pointer-lock' ? messages.pointerLock : mode === 'unlocked' ? messages.browserFallback : messages.notStarted;
  const captureModeNote = (mode: MouseCaptureMode): string => mode === 'raw-pointer-lock' ? messages.rawActive : mode === 'pointer-lock' ? messages.lockActive : messages.fallbackActive;
  const completedCaptureModeNote = (mode: MouseCaptureMode | null): string => mode === 'raw-pointer-lock' ? messages.completedRaw : mode === 'pointer-lock' ? messages.completedLock : mode === 'unlocked' ? messages.completedFallback : messages.completedUnknown;
  const setState = (nextState: ToolState, statusText: string): void => { state = nextState; root.dataset.state = nextState; status.textContent = statusText; };
  const setControlsDisabled = (disabled: boolean): void => { distanceInput.disabled = disabled; unitSelect.disabled = disabled; startButton.disabled = disabled; };
  const renderDistanceEvidence = (): void => {
    const value = Number(distanceInput.value);
    const inches = distanceToInches(value, currentUnit);
    if (inches === null) { capturedDistance.textContent = '—'; return; }
    capturedDistance.textContent = currentUnit === 'cm'
      ? `${formatNumber(value, 6)} cm · ${formatNumber(inches, 2)} in`
      : `${formatNumber(value, 6)} in`;
  };
  const renderCaptureEvidence = (): void => { captureQuality.textContent = captureModeLabel(activeCaptureMode); capturedUnits.textContent = signedHorizontalUnits === 0 ? '—' : formatCapturedUnits(signedHorizontalUnits); renderDistanceEvidence(); };
  const clearFinishClick = (): void => { if (finishClickHandler) { document.removeEventListener('click', finishClickHandler, true); finishClickHandler = null; } };
  const renderReady = (statusText = messages.ready): void => {
    setState('ready', statusText);
    setControlsDisabled(false);
    startButton.textContent = messages.start;
    instruction.textContent = messages.initialInstruction;
    captureNote.textContent = messages.capturePreference;
    result.textContent = '—';
    signedHorizontalUnits = 0;
    activeCaptureMode = null;
    renderer.reset();
    renderCaptureEvidence();
    accessibleSummary.textContent = messages.initialSummary;
  };
  const cancelMeasurement = (message: string): void => {
    sessionVersion += 1;
    clearFinishClick();
    service.stop();
    signedHorizontalUnits = 0;
    activeCaptureMode = null;
    renderer.reset();
    setControlsDisabled(false);
    startButton.textContent = messages.start;
    result.textContent = '—';
    instruction.textContent = messages.cancelledInstruction;
    captureNote.textContent = message;
    setState('cancelled', messages.cancelledStatus);
    renderCaptureEvidence();
    accessibleSummary.textContent = formatMessage(messages.cancelledSummary, { message });
  };
  const finishMeasurement = (): void => {
    if (state !== 'active') return;
    clearFinishClick();
    const completedMode = activeCaptureMode;
    service.stop();
    setControlsDisabled(false);
    const estimate = physicalDistanceInches === null ? null : calculateEstimatedDpi(signedHorizontalUnits, physicalDistanceInches, 'in');
    renderer.render({ horizontalUnits: signedHorizontalUnits });
    captureQuality.textContent = captureModeLabel(completedMode);
    capturedUnits.textContent = signedHorizontalUnits === 0 ? '—' : formatCapturedUnits(signedHorizontalUnits);
    renderDistanceEvidence();
    if (estimate === null) {
      activeCaptureMode = null;
      result.textContent = '—';
      startButton.textContent = messages.tryAgain;
      instruction.textContent = messages.noMovementInstruction;
      captureNote.textContent = messages.noMovementNote;
      setState('error', messages.noMovementStatus);
      accessibleSummary.textContent = messages.noMovementSummary;
      return;
    }
    const dpiText = Math.round(estimate).toString();
    const unitsText = formatCapturedUnits(signedHorizontalUnits);
    const note = completedCaptureModeNote(completedMode);
    result.textContent = dpiText;
    startButton.textContent = messages.measureAgain;
    instruction.textContent = messages.completeInstruction;
    captureNote.textContent = note;
    setState('result', messages.estimateReady);
    activeCaptureMode = null;
    accessibleSummary.textContent = formatMessage(messages.resultSummary, { dpi: dpiText, units: unitsText, note });
  };
  const armFinishClick = (): void => {
    clearFinishClick();
    finishClickHandler = (event) => { if (state !== 'active' || event.button !== 0) return; event.preventDefault(); event.stopPropagation(); finishMeasurement(); };
    document.addEventListener('click', finishClickHandler, true);
  };
  const handleServiceEvent = (event: MouseMovementServiceEvent): void => {
    if (destroyed || state !== 'active') return;
    if (event.type === 'cancel') {
      const reasonText = event.reason === 'escape' ? messages.escapeEnded : event.reason === 'visibility-hidden' ? messages.hiddenEnded : event.reason === 'blur' ? messages.blurEnded : messages.lockEnded;
      cancelMeasurement(reasonText);
      return;
    }
    signedHorizontalUnits += event.movementX;
    renderer.render({ horizontalUnits: signedHorizontalUnits });
    capturedUnits.textContent = signedHorizontalUnits === 0 ? '—' : formatCapturedUnits(signedHorizontalUnits);
  };
  const unsubscribe = service.subscribe(handleServiceEvent);
  const handleDistanceInput = (): void => {
    distanceInput.setCustomValidity('');
    physicalDistanceInches = distanceToInches(Number(distanceInput.value), currentUnit);
    if (state !== 'ready') { renderReady(); return; }
    renderDistanceEvidence();
  };
  const handleUnitChange = (): void => {
    const nextUnit: DistanceUnit = unitSelect.value === 'in' ? 'in' : 'cm';
    if (nextUnit === currentUnit) return;
    if (physicalDistanceInches !== null) {
      const converted = convertDistance(physicalDistanceInches, 'in', nextUnit);
      if (converted !== null) distanceInput.value = formatInputDistance(converted);
    }
    currentUnit = nextUnit;
    if (state !== 'ready') { renderReady(); return; }
    renderDistanceEvidence();
  };
  const handleSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    if (destroyed || state === 'starting' || state === 'active') return;
    const distance = Number(distanceInput.value);
    physicalDistanceInches = distanceToInches(distance, currentUnit);
    if (physicalDistanceInches === null) { distanceInput.setCustomValidity(messages.invalidDistance); distanceInput.reportValidity(); return; }
    distanceInput.setCustomValidity('');
    const version = ++sessionVersion;
    signedHorizontalUnits = 0;
    activeCaptureMode = null;
    renderer.reset();
    result.textContent = '—';
    captureQuality.textContent = messages.starting;
    capturedUnits.textContent = '—';
    renderDistanceEvidence();
    setControlsDisabled(true);
    startButton.textContent = messages.capturing;
    setState('starting', messages.startingStatus);
    instruction.textContent = messages.allowCapture;
    captureNote.textContent = messages.preparing;
    accessibleSummary.textContent = messages.startingSummary;
    const mode = await service.start(guideRoot);
    if (destroyed || version !== sessionVersion) return;
    if (mode === null) {
      setControlsDisabled(false);
      startButton.textContent = messages.tryAgain;
      captureQuality.textContent = messages.unavailable;
      setState('error', messages.captureUnavailableStatus);
      instruction.textContent = messages.captureUnavailableInstruction;
      captureNote.textContent = messages.captureUnavailableNote;
      accessibleSummary.textContent = messages.captureUnavailableSummary;
      return;
    }
    activeCaptureMode = mode;
    captureQuality.textContent = captureModeLabel(mode);
    const distanceText = formatNumber(Number(distanceInput.value), 6);
    setState('active', messages.captureActive);
    instruction.textContent = formatMessage(messages.activeInstruction, { distance: distanceText, unit: currentUnit });
    captureNote.textContent = captureModeNote(mode);
    accessibleSummary.textContent = formatMessage(messages.activeSummary, { mode: captureModeLabel(mode), distance: distanceText, unit: currentUnit });
    armFinishClick();
  };
  distanceInput.addEventListener('input', handleDistanceInput);
  unitSelect.addEventListener('change', handleUnitChange);
  form.addEventListener('submit', handleSubmit);
  renderer.reset();
  renderReady();
  const controller: MouseDpiToolController = {
    stop: () => { sessionVersion += 1; clearFinishClick(); service.stop(); if (!destroyed) renderReady(); },
    destroy: () => {
      if (destroyed) return;
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
