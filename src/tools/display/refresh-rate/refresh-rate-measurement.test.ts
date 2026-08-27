import { describe, expect, it } from 'vitest';

import { createRefreshRateMeasurement } from './refresh-rate-measurement';

describe('Refresh Rate measurement', () => {
  it('discards the first 500 ms and estimates Hz from the median valid rAF delta', () => {
    const measurement = createRefreshRateMeasurement();
    measurement.push(0);
    measurement.push(250);
    measurement.push(499);

    expect(measurement.getSnapshot().phase).toBe('warming');

    measurement.push(500);
    measurement.push(506.9444444444);
    measurement.push(513.8888888889);
    measurement.push(520.8333333333);
    const result = measurement.getSnapshot();

    expect(result.phase).toBe('measuring');
    expect(result.medianFrameTimeMs).toBeCloseTo(6.9444444444, 6);
    expect(result.estimatedHz).toBeCloseTo(144, 3);
    expect(result.closestCommonMode).toBe(144);
  });

  it('keeps only the most recent 1500 ms of valid intervals', () => {
    const measurement = createRefreshRateMeasurement();
    measurement.push(0);
    measurement.push(500);

    for (let timestamp = 600; timestamp <= 2600; timestamp += 100) {
      measurement.push(timestamp);
    }

    const result = measurement.getSnapshot();
    expect(result.intervals.length).toBe(16);
    expect(result.intervals[0]?.timestamp).toBe(1100);
    expect(result.intervals.at(-1)?.timestamp).toBe(2600);
    expect(result.estimatedHz).toBe(10);
  });

  it('ignores non-positive deltas instead of inventing an outlier filter', () => {
    const measurement = createRefreshRateMeasurement();
    measurement.push(0);
    measurement.push(500);
    measurement.push(510);
    measurement.push(510);
    measurement.push(520);

    const result = measurement.getSnapshot();
    expect(result.intervals.map((sample) => sample.deltaMs)).toEqual([10, 10]);
    expect(result.estimatedHz).toBe(100);
  });

  it('omits closest common mode when the nearest mode is outside the 3% rule', () => {
    const measurement = createRefreshRateMeasurement();
    measurement.push(0);
    measurement.push(500);
    measurement.push(512);
    measurement.push(524);

    const result = measurement.getSnapshot();
    expect(result.estimatedHz).toBeCloseTo(83.333333, 4);
    expect(result.closestCommonMode).toBeNull();
  });

  it('clears estimation and interval trace on reset and requires a fresh warmup', () => {
    const measurement = createRefreshRateMeasurement();
    measurement.push(0);
    measurement.push(500);
    measurement.push(510);
    expect(measurement.getSnapshot().estimatedHz).toBe(100);

    measurement.reset();
    expect(measurement.getSnapshot()).toMatchObject({
      phase: 'warming',
      estimatedHz: null,
      medianFrameTimeMs: null,
      closestCommonMode: null,
      intervals: [],
    });

    measurement.push(2000);
    measurement.push(2400);
    const stillWarming = measurement.getSnapshot();
    expect(stillWarming.phase).toBe('warming');
    expect(stillWarming.estimatedHz).toBeNull();
  });
});
