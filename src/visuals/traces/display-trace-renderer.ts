import type {
  CadenceTraceRenderData,
  FpsTraceRenderData,
  TracePointRenderData,
} from './display-trace-render-contract';

interface CanvasSurface {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
}

const readColor = (canvas: HTMLCanvasElement, token: string, fallback: string): string => {
  const value = getComputedStyle(canvas).getPropertyValue(token).trim();
  return value || fallback;
};

const prepareSurface = (canvas: HTMLCanvasElement): CanvasSurface | null => {
  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const backingWidth = Math.round(width * dpr);
  const backingHeight = Math.round(height * dpr);

  if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
    canvas.width = backingWidth;
    canvas.height = backingHeight;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  return { context, width, height };
};

const drawReferenceLines = (
  surface: CanvasSurface,
  color: string,
  count = 3,
): void => {
  const { context, width, height } = surface;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 1;

  for (let index = 1; index <= count; index += 1) {
    const y = (height * index) / (count + 1);
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(width, y + 0.5);
    context.stroke();
  }

  context.restore();
};

const getValueRange = (values: readonly number[]): { min: number; max: number } | null => {
  const finite = values.filter(Number.isFinite);
  if (finite.length === 0) {
    return null;
  }

  let min = Math.min(...finite);
  let max = Math.max(...finite);
  if (min === max) {
    const padding = Math.max(1, Math.abs(min) * 0.05);
    min -= padding;
    max += padding;
  } else {
    const padding = (max - min) * 0.12;
    min -= padding;
    max += padding;
  }

  return { min, max };
};

const mapX = (
  timestamp: number,
  firstTimestamp: number,
  lastTimestamp: number,
  width: number,
  padding: number,
): number => {
  const span = lastTimestamp - firstTimestamp;
  if (!Number.isFinite(span) || span <= 0) {
    return width - padding;
  }

  return padding + ((timestamp - firstTimestamp) / span) * (width - padding * 2);
};

const mapY = (
  value: number,
  min: number,
  max: number,
  height: number,
  padding: number,
): number => padding + ((max - value) / (max - min)) * (height - padding * 2);

export class FpsTraceRenderer {
  constructor(private readonly canvas: HTMLCanvasElement) {}

  render(data: FpsTraceRenderData): void {
    const surface = prepareSurface(this.canvas);
    if (!surface) {
      return;
    }

    const grid = readColor(this.canvas, '--trace-grid', '#e4e7e8');
    const neutral = readColor(this.canvas, '--trace-neutral', '#8d969a');
    const signal = readColor(this.canvas, '--trace-signal', '#176f9c');
    drawReferenceLines(surface, grid);

    const points = data.points.filter(
      (point): point is TracePointRenderData =>
        Number.isFinite(point.timestamp) && Number.isFinite(point.value),
    );
    if (points.length < 2) {
      return;
    }

    const first = points[0];
    const last = points.at(-1);
    const range = getValueRange(points.map((point) => point.value));
    if (!first || !last || !range) {
      return;
    }

    const padding = 10;
    const { context, width, height } = surface;
    context.save();
    context.strokeStyle = neutral;
    context.globalAlpha = 0.8;
    context.lineWidth = 1.5;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();

    points.forEach((point, index) => {
      const x = mapX(point.timestamp, first.timestamp, last.timestamp, width, padding);
      const y = mapY(point.value, range.min, range.max, height, padding);
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });

    context.stroke();

    const previous = points.at(-2);
    if (previous) {
      context.globalAlpha = 1;
      context.strokeStyle = signal;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(
        mapX(previous.timestamp, first.timestamp, last.timestamp, width, padding),
        mapY(previous.value, range.min, range.max, height, padding),
      );
      context.lineTo(
        mapX(last.timestamp, first.timestamp, last.timestamp, width, padding),
        mapY(last.value, range.min, range.max, height, padding),
      );
      context.stroke();
    }

    const latestX = mapX(last.timestamp, first.timestamp, last.timestamp, width, padding);
    const latestY = mapY(last.value, range.min, range.max, height, padding);
    context.globalAlpha = 1;
    context.fillStyle = signal;
    context.beginPath();
    context.arc(latestX, latestY, 3.5, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  clear(): void {
    prepareSurface(this.canvas);
  }
}

export class CadenceTraceRenderer {
  constructor(private readonly canvas: HTMLCanvasElement) {}

  render(data: CadenceTraceRenderData): void {
    const surface = prepareSurface(this.canvas);
    if (!surface) {
      return;
    }

    const grid = readColor(this.canvas, '--trace-grid', '#e4e7e8');
    const neutral = readColor(this.canvas, '--trace-neutral', '#8d969a');
    const signal = readColor(this.canvas, '--trace-signal', '#176f9c');
    drawReferenceLines(surface, grid, 1);

    const intervals = data.intervals.filter(
      (sample) =>
        Number.isFinite(sample.timestamp) &&
        Number.isFinite(sample.deltaMs) &&
        sample.deltaMs > 0,
    );
    if (intervals.length === 0) {
      return;
    }

    const first = intervals[0];
    const last = intervals.at(-1);
    const values = intervals.map((sample) => sample.deltaMs);
    if (data.medianMs !== null && Number.isFinite(data.medianMs)) {
      values.push(data.medianMs);
    }
    const range = getValueRange(values);
    if (!first || !last || !range) {
      return;
    }

    const padding = 10;
    const { context, width, height } = surface;
    const medianY =
      data.medianMs === null
        ? height / 2
        : mapY(data.medianMs, range.min, range.max, height, padding);

    context.save();
    context.strokeStyle = neutral;
    context.lineWidth = 1;
    context.setLineDash([4, 4]);
    context.beginPath();
    context.moveTo(padding, medianY + 0.5);
    context.lineTo(width - padding, medianY + 0.5);
    context.stroke();
    context.setLineDash([]);

    context.globalAlpha = 0.55;
    context.beginPath();
    intervals.forEach((sample) => {
      const x = mapX(sample.timestamp, first.timestamp, last.timestamp, width, padding);
      const y = mapY(sample.deltaMs, range.min, range.max, height, padding);
      context.moveTo(x, medianY);
      context.lineTo(x, y);
    });
    context.stroke();

    const latestY = mapY(last.deltaMs, range.min, range.max, height, padding);
    const latestX = mapX(last.timestamp, first.timestamp, last.timestamp, width, padding);
    context.globalAlpha = 1;
    context.fillStyle = signal;
    context.beginPath();
    context.arc(latestX, latestY, 3, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  clear(): void {
    prepareSurface(this.canvas);
  }
}
