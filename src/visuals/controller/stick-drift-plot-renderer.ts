import type { StickPlotPosition } from './stick-plot-contract';

const CENTER = 50;
const TRAVEL = 42;
const DETAIL_RADIUS = 0.2;
const TRAIL_LIMIT = 24;

const requireElement = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Stick drift plot is missing ${selector}`);
  }
  return element;
};

const toPlotCoordinate = (value: number): number => {
  const normalized = Math.min(1, Math.max(-1, value / DETAIL_RADIUS));
  return CENTER + normalized * TRAVEL;
};

export class StickDriftPlotRenderer {
  private readonly point: SVGCircleElement;
  private readonly trail: SVGGElement;
  private readonly trailPoints: StickPlotPosition[] = [];

  constructor(private readonly root: HTMLElement) {
    this.point = requireElement<SVGCircleElement>(root, '[data-stick-drift-point]');
    this.trail = requireElement<SVGGElement>(root, '[data-stick-drift-trail]');
  }

  render(position: StickPlotPosition, recordTrail: boolean): void {
    if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
      return;
    }

    this.point.setAttribute('cx', toPlotCoordinate(position.x).toFixed(2));
    this.point.setAttribute('cy', toPlotCoordinate(position.y).toFixed(2));
    this.root.dataset.live = 'true';

    if (recordTrail) {
      this.trailPoints.push(position);
      if (this.trailPoints.length > TRAIL_LIMIT) {
        this.trailPoints.shift();
      }
      this.renderTrail();
    }
  }

  reset(): void {
    this.point.setAttribute('cx', CENTER.toString());
    this.point.setAttribute('cy', CENTER.toString());
    this.root.dataset.live = 'false';
    this.trailPoints.length = 0;
    this.trail.replaceChildren();
  }

  private renderTrail(): void {
    const fragment = document.createDocumentFragment();
    const count = this.trailPoints.length;

    this.trailPoints.forEach((position, index) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'stick-drift-trail-point');
      circle.setAttribute('cx', toPlotCoordinate(position.x).toFixed(2));
      circle.setAttribute('cy', toPlotCoordinate(position.y).toFixed(2));
      circle.setAttribute('r', '1.7');
      circle.setAttribute('opacity', (((index + 1) / count) * 0.55).toFixed(2));
      fragment.append(circle);
    });

    this.trail.replaceChildren(fragment);
  }
}
