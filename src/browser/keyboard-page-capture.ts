const capturedNavigationCodes = new Set([
  'Space',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

export interface KeyboardPageCapture {
  capture(focusSurface?: boolean): void;
  release(): void;
  destroy(): void;
}

const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) {
    return false;
  }

  const interactive = target.closest<HTMLElement>(
    'input, select, textarea, button, a[href], [contenteditable="true"]',
  );
  if (!interactive) {
    return false;
  }

  return !(interactive instanceof HTMLButtonElement && interactive.disabled);
};

export const mountKeyboardPageCapture = (surface: HTMLElement): KeyboardPageCapture => {
  let active = true;
  let destroyed = false;

  const renderState = (): void => {
    surface.dataset.captureActive = active ? 'true' : 'false';
  };

  const capture = (focusSurface = false): void => {
    if (destroyed) {
      return;
    }
    active = true;
    renderState();
    if (focusSurface) {
      surface.focus({ preventScroll: true });
    }
  };

  const release = (): void => {
    if (destroyed || !active) {
      return;
    }
    active = false;
    renderState();
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    if (!active || destroyed || isInteractiveTarget(event.target)) {
      return;
    }

    if (event.code === 'Escape') {
      release();
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    if (capturedNavigationCodes.has(event.code)) {
      event.preventDefault();
    }
  };

  const handleSurfacePointerDown = (event: PointerEvent): void => {
    if (!isInteractiveTarget(event.target)) {
      capture(true);
    }
  };

  const handleDocumentPointerDown = (event: PointerEvent): void => {
    if (event.target instanceof Node && !surface.contains(event.target)) {
      release();
    }
  };

  const handleDocumentFocusIn = (event: FocusEvent): void => {
    if (event.target instanceof Node && !surface.contains(event.target)) {
      release();
    }
  };

  const handleFocus = (): void => capture(false);

  document.addEventListener('keydown', handleKeydown, true);
  document.addEventListener('pointerdown', handleDocumentPointerDown, true);
  document.addEventListener('focusin', handleDocumentFocusIn);
  surface.addEventListener('pointerdown', handleSurfacePointerDown);
  surface.addEventListener('focus', handleFocus);
  renderState();

  return {
    capture,
    release,
    destroy: () => {
      if (destroyed) {
        return;
      }
      destroyed = true;
      document.removeEventListener('keydown', handleKeydown, true);
      document.removeEventListener('pointerdown', handleDocumentPointerDown, true);
      document.removeEventListener('focusin', handleDocumentFocusIn);
      surface.removeEventListener('pointerdown', handleSurfacePointerDown);
      surface.removeEventListener('focus', handleFocus);
      surface.dataset.captureActive = 'false';
    },
  };
};
