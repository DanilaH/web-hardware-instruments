import { describe, expect, it } from 'vitest';

import { createFpsMeasurement } from './fps-measurement';

describe('FPS measurement', () => {
  it('discards the first 500 ms and applies the documented rolling FPS formula', () => {
    const measurement = createFpsMeasurement();

    measurement.push(0);
    measurement.push(100);
    measurement.push(200);
    measurement.push(300);
    measurement.push(400);

    expect(measurement.getSnapshot()).toMatchObject({
      phase: 'warming',
      fps: null,
      medianFrameTimeMs: null,
      trace: [],
    });

    measurement.push(500);
    measurement.push(600);
    const result = measurement.getSnapshot();

    expect(result.phase).toBe('measuring');
    expect(result.fps).toBe(10);
    expect(result.medianFrameTimeMs).toBe(100);
  });

  it('uses only the most recent 1000 ms of timestamps', () => {
    const measurement = createFpsMeasurement();
    measurement.push(0);
    measurement.push(500);

    for (let timestamp = 600; timestamp <= 1800; timestamp += 100) {
      measurement.push(timestamp);
    }

    const result = measurement.getSnapshot();
    expect(result.fps).toBe(10);
    expect(result.medianFrameTimeMs).toBe(100);
  });

  it('stores one trace point no more often than every 250 ms and caps history at 8 seconds', () => {
    const measurement = createFpsMeasurement();
    measurement.push(0);
    measurement.push(500);

    for (let timestamp = 600; timestamp <= 10_000; timestamp += 100) {
      measurement.push(timestamp);
      measurement.getSnapshot();
    }

    const trace = measurement.getSnapshot().trace;
    expect(trace.length).toBeGreaterThan(0);

    for (let index = 1; index < trace.length; index += 1) {
      const previous = trace[index - 1];
      const current = trace[index];
      expect(previous).toBeDefined();
      expect(current).toBeDefined();
      expect(current!.timestamp - previous!.timestamp).toBeGreaterThanOrEqual(250);
    }

    expect(trace[0]!.timestamp).toBeGreaterThanOrEqual(2000);
    expect(trace.at(-1)!.timestamp).toBeLessThanOrEqual(10_000);
  });

  it('clears window and trace state on reset and requires a fresh warmup', () => {
    const measurement = createFpsMeasurement();
    measurement.push(0);
    measurement.push(500);
    measurement.push(600);
    expect(measurement.getSnapshot().fps).toBe(10);

    measurement.reset();
    expect(measurement.getSnapshot()).toMatchObject({
      phase: 'warming',
      fps: null,
      medianFrameTimeMs: null,
      trace: [],
    });

    measurement.push(2000);
    measurement.push(2400);
    const stillWarming = measurement.getSnapshot();
    expect(stillWarming.phase).toBe('warming');
    expect(stillWarming.fps).toBeNull();
  });

  it('uses only positive finite deltas for median frame time', () => {
    const measurement = createFpsMeasurement();
    measurement.push(0);
    measurement.push(500);
    measurement.push(600);
    measurement.push(600);
    measurement.push(700);
    const result = measurement.getSnapshot();

    expect(result.medianFrameTimeMs).toBe(100);
  });
});
