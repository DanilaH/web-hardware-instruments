export interface BrowserScreenInfo {
  readonly screenWidthCss: number;
  readonly screenHeightCss: number;
  readonly availWidthCss: number;
  readonly availHeightCss: number;
  readonly viewportWidthCss: number;
  readonly viewportHeightCss: number;
  readonly devicePixelRatio: number;
  readonly estimatedDevicePixelWidth: number;
  readonly estimatedDevicePixelHeight: number;
  readonly colorDepth?: number;
  readonly orientation?: string;
}

export interface BrowserScreenInfoSource {
  readonly screenWidthCss: number;
  readonly screenHeightCss: number;
  readonly availWidthCss: number;
  readonly availHeightCss: number;
  readonly viewportWidthCss: number;
  readonly viewportHeightCss: number;
  readonly devicePixelRatio: number;
  readonly colorDepth?: number;
  readonly orientation?: string;
}

export const estimateDevicePixelDimension = (cssPixels: number, devicePixelRatio: number): number =>
  Math.round(cssPixels * devicePixelRatio);

export const createBrowserScreenInfo = (source: BrowserScreenInfoSource): BrowserScreenInfo => ({
  ...source,
  estimatedDevicePixelWidth: estimateDevicePixelDimension(source.screenWidthCss, source.devicePixelRatio),
  estimatedDevicePixelHeight: estimateDevicePixelDimension(source.screenHeightCss, source.devicePixelRatio),
});

export const readBrowserScreenInfo = (view: Window = window): BrowserScreenInfo => {
  const orientation = view.screen.orientation?.type;

  return createBrowserScreenInfo({
    screenWidthCss: view.screen.width,
    screenHeightCss: view.screen.height,
    availWidthCss: view.screen.availWidth,
    availHeightCss: view.screen.availHeight,
    viewportWidthCss: view.innerWidth,
    viewportHeightCss: view.innerHeight,
    devicePixelRatio: view.devicePixelRatio,
    colorDepth: view.screen.colorDepth,
    ...(orientation ? { orientation } : {}),
  });
};
