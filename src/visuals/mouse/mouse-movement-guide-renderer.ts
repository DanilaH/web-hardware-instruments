export interface MouseMovementGuideRenderData {
  horizontalUnits: number;
}

const CENTER_X = 50;
const MAX_TRAVEL = 39;
const RESPONSE_UNITS = 280;

export class MouseMovementGuideRenderer {
  private readonly dot: SVGCircleElement;

  constructor(private readonly root: HTMLElement) {
    const dot = root.querySelector<SVGCircleElement>('[data-mouse-guide-dot]');
    if (!dot) {
      throw new Error('Mouse movement guide is missing its live dot');
    }
    this.dot = dot;
  }

  render(data: MouseMovementGuideRenderData): void {
    if (!Number.isFinite(data.horizontalUnits)) {
      return;
    }

    const normalized = Math.tanh(data.horizontalUnits / RESPONSE_UNITS);
    const x = CENTER_X + normalized * MAX_TRAVEL;
    this.dot.setAttribute('cx', x.toFixed(2));
    this.root.dataset.active = Math.abs(data.horizontalUnits) > 0 ? 'true' : 'false';
  }

  reset(): void {
    this.dot.setAttribute('cx', CENTER_X.toString());
    this.root.dataset.active = 'false';
  }
}
