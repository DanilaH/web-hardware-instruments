import { readBrowserScreenInfo } from './screen-info';

export interface ScreenResolutionController {
  start(): void;
  stop(): void;
  destroy(): void;
}

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Screen Resolution Checker is missing ${selector}`);
  return element;
};

const formatDimensions = (width: number, height: number): string => `${width} × ${height}`;

export const mountScreenResolutionChecker = (root: HTMLElement): ScreenResolutionController => {
  const screenSize = requireElement<HTMLElement>(root, '[data-resolution-screen-size]');
  const estimatedDevicePixels = requireElement<HTMLElement>(root, '[data-resolution-device-pixels]');
  const viewport = requireElement<HTMLElement>(root, '[data-resolution-viewport]');
  const available = requireElement<HTMLElement>(root, '[data-resolution-available]');
  const dpr = requireElement<HTMLElement>(root, '[data-resolution-dpr]');
  const colorDepth = requireElement<HTMLElement>(root, '[data-resolution-color-depth]');
  const orientationRow = requireElement<HTMLElement>(root, '[data-resolution-orientation-row]');
  const orientationValue = requireElement<HTMLElement>(root, '[data-resolution-orientation]');

  let running = false;
  let destroyed = false;

  const render = (): void => {
    if (destroyed) return;
    const info = readBrowserScreenInfo();

    screenSize.textContent = formatDimensions(info.screenWidthCss, info.screenHeightCss);
    estimatedDevicePixels.textContent = formatDimensions(info.estimatedDevicePixelWidth, info.estimatedDevicePixelHeight);
    viewport.textContent = formatDimensions(info.viewportWidthCss, info.viewportHeightCss);
    available.textContent = formatDimensions(info.availWidthCss, info.availHeightCss);
    dpr.textContent = String(info.devicePixelRatio);
    colorDepth.textContent = info.colorDepth === undefined ? '—' : String(info.colorDepth);
    orientationValue.textContent = info.orientation ?? '—';
    orientationRow.hidden = info.orientation === undefined;
  };

  const handleResize = (): void => render();
  const handleOrientationChange = (): void => render();

  const start = (): void => {
    if (destroyed) return;
    render();
    if (running) return;
    running = true;
    window.addEventListener('resize', handleResize);
    window.screen.orientation?.addEventListener('change', handleOrientationChange);
  };

  const stop = (): void => {
    if (!running) return;
    running = false;
    window.removeEventListener('resize', handleResize);
    window.screen.orientation?.removeEventListener('change', handleOrientationChange);
  };

  start();

  return {
    start,
    stop,
    destroy: () => {
      if (destroyed) return;
      stop();
      destroyed = true;
    },
  };
};
