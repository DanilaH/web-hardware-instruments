import {
  createFullscreenHelper,
  type FullscreenHelper,
} from '../../../browser/fullscreen';

export interface DisplayInspectionStageController {
  start(): void;
  stop(): void;
  showOverlay(): void;
  destroy(): void;
  isActive(): boolean;
}

interface DisplayInspectionStageOptions {
  root: HTMLElement;
  stage: HTMLElement;
  startButton: HTMLButtonElement;
  exitButton: HTMLButtonElement;
  fullscreenNote: HTMLElement;
  fullscreen?: FullscreenHelper;
  overlayIdleMs?: number;
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Display inspection stage is missing ${selector}`);
  return element;
};

export const mountDisplayInspectionStage = ({
  root,
  stage,
  startButton,
  exitButton,
  fullscreenNote,
  fullscreen = createFullscreenHelper(),
  overlayIdleMs = 1_500,
}: DisplayInspectionStageOptions): DisplayInspectionStageController => {
  const overlay = requireElement<HTMLElement>(stage, '[data-inspection-overlay]');
  let active = false;
  let destroyed = false;
  let overlayTimer: number | null = null;

  const clearOverlayTimer = (): void => {
    if (overlayTimer === null) return;
    window.clearTimeout(overlayTimer);
    overlayTimer = null;
  };

  const hideOverlayLater = (): void => {
    clearOverlayTimer();
    if (!active || destroyed) return;
    overlayTimer = window.setTimeout(() => {
      overlayTimer = null;
      if (!active || destroyed) return;
      if (overlay.contains(document.activeElement)) {
        stage.dataset.overlayVisible = 'true';
        return;
      }
      stage.dataset.overlayVisible = 'false';
    }, overlayIdleMs);
  };

  const showOverlay = (): void => {
    if (!active || destroyed) return;
    stage.dataset.overlayVisible = 'true';
    hideOverlayLater();
  };

  const syncFullscreenState = (): void => {
    if (destroyed) return;
    const stageIsFullscreen = fullscreen.getActiveElement() === stage;
    root.dataset.fullscreen = stageIsFullscreen ? 'true' : 'false';
    if (active && !stageIsFullscreen) showOverlay();
  };

  const activate = async (): Promise<void> => {
    if (destroyed || active) return;
    active = true;
    root.dataset.active = 'true';
    stage.hidden = false;
    stage.dataset.overlayVisible = 'true';
    fullscreenNote.textContent = '';
    stage.focus({ preventScroll: true });
    showOverlay();

    if (!fullscreen.isSupported()) {
      fullscreenNote.textContent = 'Full screen unavailable — continue in-page.';
      return;
    }

    const enteredFullscreen = await fullscreen.request(stage);
    if (destroyed || !active) return;
    if (!enteredFullscreen) {
      fullscreenNote.textContent = 'Full screen unavailable — continue in-page.';
    }
    syncFullscreenState();
  };

  const deactivate = async (): Promise<void> => {
    if (destroyed || !active) return;
    clearOverlayTimer();

    if (fullscreen.getActiveElement() === stage) {
      const exitedFullscreen = await fullscreen.exit();
      if (destroyed) return;
      if (!exitedFullscreen && fullscreen.getActiveElement() === stage) {
        showOverlay();
        return;
      }
    }

    active = false;
    clearOverlayTimer();
    root.dataset.active = 'false';
    root.dataset.fullscreen = 'false';
    stage.hidden = true;
    stage.dataset.overlayVisible = 'true';
    fullscreenNote.textContent = '';
    startButton.focus({ preventScroll: true });
  };

  const handleStart = (): void => {
    void activate();
  };

  const handleExit = (event: Event): void => {
    event.stopPropagation();
    void deactivate();
  };

  const handleActivity = (): void => {
    showOverlay();
  };

  const handleOverlayFocusOut = (): void => {
    hideOverlayLater();
  };

  startButton.addEventListener('click', handleStart);
  exitButton.addEventListener('click', handleExit);
  stage.addEventListener('pointermove', handleActivity);
  stage.addEventListener('pointerdown', handleActivity);
  stage.addEventListener('keydown', handleActivity);
  overlay.addEventListener('focusin', handleActivity);
  overlay.addEventListener('focusout', handleOverlayFocusOut);
  const unsubscribeFullscreen = fullscreen.subscribe(syncFullscreenState);

  root.dataset.active = 'false';
  root.dataset.fullscreen = 'false';

  return {
    start: () => {
      if (destroyed) return;
      syncFullscreenState();
    },
    stop: () => {
      if (destroyed) return;
      clearOverlayTimer();
      if (fullscreen.getActiveElement() === stage) void fullscreen.exit();
      active = false;
      root.dataset.active = 'false';
      root.dataset.fullscreen = 'false';
      stage.hidden = true;
      stage.dataset.overlayVisible = 'true';
      fullscreenNote.textContent = '';
    },
    showOverlay,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      clearOverlayTimer();
      startButton.removeEventListener('click', handleStart);
      exitButton.removeEventListener('click', handleExit);
      stage.removeEventListener('pointermove', handleActivity);
      stage.removeEventListener('pointerdown', handleActivity);
      stage.removeEventListener('keydown', handleActivity);
      overlay.removeEventListener('focusin', handleActivity);
      overlay.removeEventListener('focusout', handleOverlayFocusOut);
      unsubscribeFullscreen();
      fullscreen.destroy();
    },
    isActive: () => active && !destroyed,
  };
};
