import type { StickPosition } from '../../tools/gamepad/drift/stick-drift-measurement';

const CENTER = 50;
const TRAVEL = 42;

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Stick deadzone plot is missing ${selector}`);
  }
  return element;
};

const toPlotCoordinate = (value: number): number => CENTER + value * TRAVEL;
const toRadius = (value: number): number => Math.min(1, Math.max(0, value)) * TRAVEL;

export class StickDeadzonePlotRenderer {
  private readonly point: SVGCircleElement;
  private readonly noiseRing: SVGCircleElement;
  private readonly suggestedRing: SVGCircleElement;
  private readonly legend: HTMLElement;
  private readonly label: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.point = requireElement<SVGCircleElement>(root, '[data-deadzone-point]');
    this.noiseRing = requireElement<SVGCircleElement>(root, '[data-deadzone-noise-ring]');
    this.suggestedRing = requireElement<SVGCircleElement>(root, '[data-deadzone-suggested-ring]');
    this.legend = requireElement<HTMLElement>(root, '[data-deadzone-legend]');
    this.label = requireElement<HTMLElement>(root, '[data-deadzone-plot-label]');
  }

  renderPosition(position: StickPosition): void {
    if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
      return;
    }

    this.point.setAttribute('cx', toPlotCoordinate(position.x).toFixed(2));
    this.point.setAttribute('cy', toPlotCoordinate(position.y).toFixed(2));
    this.root.dataset.live = 'true';
  }

  renderResult(centerNoise: number, suggestedDeadzone: number): void {
    if (!Number.isFinite(centerNoise) || !Number.isFinite(suggestedDeadzone)) {
      return;
    }

    this.noiseRing.setAttribute('r', toRadius(centerNoise).toFixed(2));
    this.suggestedRing.setAttribute('r', toRadius(suggestedDeadzone).toFixed(2));
    this.legend.hidden = false;
    this.root.dataset.result = 'true';
  }

  setSideLabel(side: 'left' | 'right'): void {
    this.label.textContent = side === 'left' ? 'Left stick' : 'Right stick';
  }

  resetResult(): void {
    this.noiseRing.setAttribute('r', '0');
    this.suggestedRing.setAttribute('r', '0');
    this.legend.hidden = true;
    this.root.dataset.result = 'false';
  }

  reset(): void {
    this.point.setAttribute('cx', CENTER.toString());
    this.point.setAttribute('cy', CENTER.toString());
    this.root.dataset.live = 'false';
    this.resetResult();
  }
}
