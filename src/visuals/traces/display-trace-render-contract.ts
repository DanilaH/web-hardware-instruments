export interface TracePointRenderData {
  timestamp: number;
  value: number;
}

export interface FpsTraceRenderData {
  points: readonly TracePointRenderData[];
}

export interface FrameIntervalRenderData {
  timestamp: number;
  deltaMs: number;
}

export interface CadenceTraceRenderData {
  intervals: readonly FrameIntervalRenderData[];
  medianMs: number | null;
}
