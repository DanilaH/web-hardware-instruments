export interface PollingRateResult {
  readonly observedRateHz: number;
  readonly medianIntervalMs: number;
  readonly validIntervals: number;
}

export const calculatePollingRate = (timestamps: readonly number[]): PollingRateResult | null => {
  const monotonic: number[] = [];

  for (const value of timestamps) {
    if (!Number.isFinite(value)) continue;
    const previous = monotonic.at(-1);
    if (previous === undefined || value > previous) monotonic.push(value);
  }

  const intervals: number[] = [];
  for (let index = 1; index < monotonic.length; index += 1) {
    const current = monotonic[index];
    const previous = monotonic[index - 1];
    if (current === undefined || previous === undefined) continue;
    const delta = current - previous;
    if (Number.isFinite(delta) && delta > 0) intervals.push(delta);
  }

  if (intervals.length < 20) return null;

  const sorted = [...intervals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
    : (sorted[mid] ?? 0);

  if (!(median > 0)) return null;

  return {
    observedRateHz: Math.round(1000 / median),
    medianIntervalMs: median,
    validIntervals: intervals.length,
  };
};
