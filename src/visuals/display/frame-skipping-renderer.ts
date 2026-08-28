export interface FrameSkippingRenderData {
  readonly slot: number | null;
  readonly slotCount: number;
}

export class FrameSkippingRenderer {
  private readonly context: CanvasRenderingContext2D | null;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d');
  }

  isSupported(): boolean {
    return this.context !== null;
  }

  clear(): void {
    if (!this.context) return;
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render(view: FrameSkippingRenderData): void {
    this.clear();
    if (!this.context || view.slot === null || view.slotCount <= 0) return;

    const slot = Math.min(view.slotCount - 1, Math.max(0, Math.trunc(view.slot)));
    const slotWidth = this.canvas.width / view.slotCount;
    const squareSize = Math.max(2, Math.min(slotWidth * 0.72, this.canvas.height * 0.55));
    const x = slot * slotWidth + (slotWidth - squareSize) / 2;
    const y = (this.canvas.height - squareSize) / 2;

    this.context.fillStyle = '#f5f7f8';
    this.context.fillRect(x, y, squareSize, squareSize);
  }
}
