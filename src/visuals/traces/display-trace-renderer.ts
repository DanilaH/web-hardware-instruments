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

interface ValueRange {
  min: number;
  max: number;
}

interface PlotBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const FPS_BOUNDS: PlotBounds = { left: 36, right: 10, top: 10, bottom: 12 };

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

const getValueRange = (values: readonly number[]): ValueRange | null => {
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

const getFpsValueRange = (values: readonly number[]): ValueRange | null => {
  const finite = values.filter(Number.isFinite);
  if (finite.length === 0) {
    return null;
  }

  const rawMin = Math.min(...finite);
  const rawMax = Math.max(...finite);
  const center = (rawMin + rawMax) / 2;
  const rawSpan = rawMax - rawMin;
  const minimumSpan = Math.max(4, Math.abs(center) * 0.08);
  const span = Math.max(minimumSpan, rawSpan * 1.24);
  let min = center - span / 2;
  let max = center + span / 2;

  if (min < 0) {
    max -= min;
    min = 0;
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

const mapXInBounds = (
  timestamp: number,
  firstTimestamp: number,
  lastTimestamp: number,
  width: number,
  bounds: PlotBounds,
): number => {
  const span = lastTimestamp - firstTimestamp;
  const plotWidth = Math.max(1, width - bounds.left - bounds.right);
  if (!Number.isFinite(span) || span <= 0) {
    return bounds.left + plotWidth;
  }
  return bounds.left + ((timestamp - firstTimestamp) / span) * plotWidth;
};

const mapYInBounds = (
  value: number,
  range: ValueRange,
  height: number,
  bounds: PlotBounds,
): number => {
  const plotHeight = Math.max(1, height - bounds.top - bounds.bottom);
  return bounds.top + ((range.max - value) / (range.max - range.min)) * plotHeight;
};

const drawFpsScale = (
  surface: CanvasSurface,
  range: ValueRange,
  gridColor: string,
  labelColor: string,
): void => {
  const { context, width, height } = surface;
  const levels = [range.max, (range.max + range.min) / 2, range.min];

  context.save();
  context.lineWidth = 1;
  context.font = '10px ui-monospace, SFMono-Regular, Consolas, monospace';
  context.textAlign = 'left';
  context.textBaseline = 'middle';

  for (const value of levels) {
    const y = mapYInBounds(value, range, height, FPS_BOUNDS);
    context.fillStyle = labelColor;
    context.fillText(Math.round(value).toString(), 2, y);
    context.strokeStyle = gridColor;
    context.beginPath();
    context.moveTo(FPS_BOUNDS.left, y + 0.5);
    context.lineTo(width - FPS_BOUNDS.right, y + 0.5);
    context.stroke();
  }

  context.restore();
};

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
    const points = data.points.filter(
      (point): point is TracePointRenderData =>
        Number.isFinite(point.timestamp) && Number.isFinite(point.value),
    );
    const range = getFpsValueRange(points.map((point) => point.value));
    if (!range) {
      return;
    }

    drawFpsScale(surface, range, grid, neutral);

    if (points.length < 2) {
      return;
    }

    const first = points[0];
    const last = points.at(-1);
    if (!first || !last) {
      return;
    }

    const { context, width, height } = surface;
    context.save();
    context.strokeStyle = neutral;
    context.globalAlpha = 0.8;
    context.lineWidth = 1.5;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();

    points.forEach((point, index) => {
      const x = mapXInBounds(point.timestamp, first.timestamp, last.timestamp, width, FPS_BOUNDS);
      const y = mapYInBounds(point.value, range, height, FPS_BOUNDS);
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
        mapXInBounds(previous.timestamp, first.timestamp, last.timestamp, width, FPS_BOUNDS),
        mapYInBounds(previous.value, range, height, FPS_BOUNDS),
      );
      context.lineTo(
        mapXInBounds(last.timestamp, first.timestamp, last.timestamp, width, FPS_BOUNDS),
        mapYInBounds(last.value, range, height, FPS_BOUNDS),
      );
      context.stroke();
    }

    const latestX = mapXInBounds(last.timestamp, first.timestamp, last.timestamp, width, FPS_BOUNDS);
    const latestY = mapYInBounds(last.value, range, height, FPS_BOUNDS);
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
