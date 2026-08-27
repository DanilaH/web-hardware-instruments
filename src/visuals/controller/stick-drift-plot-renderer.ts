import type { StickPlotPosition } from './stick-plot-contract';

const CENTER = 50;
const TRAVEL = 42;
const DETAIL_RADIUS = 0.2;
const TRAIL_LIMIT = 24;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

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
  private readonly trailPoints: StickPlotPosition[] = [];
  private readonly trailElements: readonly SVGCircleElement[];

  constructor(private readonly root: HTMLElement) {
    this.point = requireElement<SVGCircleElement>(root, '[data-stick-drift-point]');
    const trail = requireElement<SVGGElement>(root, '[data-stick-drift-trail]');

    this.trailElements = Array.from({ length: TRAIL_LIMIT }, () => {
      const circle = document.createElementNS(SVG_NAMESPACE, 'circle');
      circle.setAttribute('class', 'stick-drift-trail-point');
      circle.setAttribute('r', '1.7');
      circle.setAttribute('display', 'none');
      trail.append(circle);
      return circle;
    });
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
    this.renderTrail();
  }

  private renderTrail(): void {
    const count = this.trailPoints.length;

    this.trailElements.forEach((circle, index) => {
      const position = this.trailPoints[index];
      if (!position) {
        circle.setAttribute('display', 'none');
        return;
      }

      circle.removeAttribute('display');
      circle.setAttribute('cx', toPlotCoordinate(position.x).toFixed(2));
      circle.setAttribute('cy', toPlotCoordinate(position.y).toFixed(2));
      circle.setAttribute('opacity', (((index + 1) / count) * 0.55).toFixed(2));
    });
  }
}
