export interface FrameSkippingRenderData {
  readonly slot: number | null;
  readonly slotCount: number;
}

interface FrameSkippingSurface {
  readonly context: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;
}

export class FrameSkippingRenderer {
  private readonly context: CanvasRenderingContext2D | null;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d');
  }

  isSupported(): boolean {
    return this.context !== null;
  }

  private prepareSurface(): FrameSkippingSurface | null {
    if (!this.context) return null;

    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const backingWidth = Math.round(width * dpr);
    const backingHeight = Math.round(height * dpr);

    if (this.canvas.width !== backingWidth || this.canvas.height !== backingHeight) {
      this.canvas.width = backingWidth;
      this.canvas.height = backingHeight;
    }

    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { context: this.context, width, height };
  }

  clear(): void {
    const surface = this.prepareSurface();
    if (!surface) return;
    surface.context.fillStyle = '#000000';
    surface.context.fillRect(0, 0, surface.width, surface.height);
  }

  render(view: FrameSkippingRenderData): void {
    const surface = this.prepareSurface();
    if (!surface) return;

    surface.context.fillStyle = '#000000';
    surface.context.fillRect(0, 0, surface.width, surface.height);
    if (view.slot === null || view.slotCount <= 0) return;

    const slot = Math.min(view.slotCount - 1, Math.max(0, Math.trunc(view.slot)));
    const slotWidth = surface.width / view.slotCount;
    const squareSize = Math.max(2, Math.min(slotWidth * 0.82, surface.height * 0.55));
    const x = slot * slotWidth + (slotWidth - squareSize) / 2;
    const y = (surface.height - squareSize) / 2;

    surface.context.fillStyle = '#f5f7f8';
    surface.context.fillRect(x, y, squareSize, squareSize);
  }
}
