import { describe, expect, it } from 'vitest';
import {
  createFrameSkippingReadinessState,
  frameSkippingDeltaWindowSize,
  frameSkippingSlotCount,
  getFrameSkippingReadinessSnapshot,
  pushFrameSkippingSample,
} from './frame-skipping-readiness';

const pushStableFrames = (
  count: number,
  intervalMs = 16,
) => {
  let state = createFrameSkippingReadinessState();
  let timestamp = 0;
  state = pushFrameSkippingSample(state, timestamp);
  for (let index = 0; index < count; index += 1) {
    timestamp += intervalMs;
    state = pushFrameSkippingSample(state, timestamp);
  }
  return { state, timestamp };
};

describe('Frame Skipping readiness state', () => {
  it('requires the full warmup even when enough stable deltas already exist', () => {
    const { state } = pushStableFrames(60, 16);
    const snapshot = getFrameSkippingReadinessSnapshot(state);

    expect(snapshot.collectedDeltas).toBe(60);
    expect(snapshot.phase).toBe('warming');
    expect(snapshot.ready).toBe(false);
    expect(snapshot.slot).toBeNull();
  });

  it('enters a fresh READY epoch at ordinal zero after stable warmup', () => {
    const { state } = pushStableFrames(63, 16);
    const snapshot = getFrameSkippingReadinessSnapshot(state);

    expect(snapshot.phase).toBe('ready');
    expect(snapshot.frameOrdinal).toBe(0);
    expect(snapshot.slot).toBe(0);
  });

  it('advances exactly one slot for each subsequent valid READY sample', () => {
    const stable = pushStableFrames(63, 16);
    const next = pushFrameSkippingSample(stable.state, stable.timestamp + 20);
    const snapshot = getFrameSkippingReadinessSnapshot(next);

    expect(snapshot.ready).toBe(true);
    expect(snapshot.frameOrdinal).toBe(1);
    expect(snapshot.slot).toBe(1);
  });

  it('does not derive a larger slot jump from a longer but still stable interval', () => {
    const stable = pushStableFrames(63, 16);
    const next = pushFrameSkippingSample(stable.state, stable.timestamp + 23);
    const snapshot = getFrameSkippingReadinessSnapshot(next);

    expect(snapshot.ready).toBe(true);
    expect(snapshot.frameOrdinal).toBe(1);
    expect(snapshot.slot).toBe(1);
  });

  it('invalidates the READY epoch before advancing when the current delta breaks stability', () => {
    const stable = pushStableFrames(63, 16);
    const invalidated = pushFrameSkippingSample(stable.state, stable.timestamp + 24);
    const snapshot = getFrameSkippingReadinessSnapshot(invalidated);

    expect(snapshot.ready).toBe(false);
    expect(snapshot.phase).toBe('waiting');
    expect(snapshot.frameOrdinal).toBeNull();
    expect(snapshot.slot).toBeNull();
  });

  it('starts a new epoch at zero after the unstable delta ages out of the recent window', () => {
    const stable = pushStableFrames(63, 16);
    let state = pushFrameSkippingSample(stable.state, stable.timestamp + 24);
    let timestamp = stable.timestamp + 24;

    for (let index = 0; index < 30; index += 1) {
      timestamp += 16;
      state = pushFrameSkippingSample(state, timestamp);
    }

    const snapshot = getFrameSkippingReadinessSnapshot(state);
    expect(snapshot.ready).toBe(true);
    expect(snapshot.frameOrdinal).toBe(0);
    expect(snapshot.slot).toBe(0);
  });

  it('wraps the visual slot without changing the sequential ordinal model', () => {
    let { state, timestamp } = pushStableFrames(63, 16);
    for (let index = 0; index < frameSkippingSlotCount; index += 1) {
      timestamp += 16;
      state = pushFrameSkippingSample(state, timestamp);
    }

    const snapshot = getFrameSkippingReadinessSnapshot(state);
    expect(snapshot.frameOrdinal).toBe(frameSkippingSlotCount);
    expect(snapshot.slot).toBe(0);
  });

  it('bounds the rolling delta history to sixty samples', () => {
    const { state } = pushStableFrames(120, 16);
    expect(state.deltas).toHaveLength(frameSkippingDeltaWindowSize);
  });

  it('invalidates an active epoch on a non-positive delta', () => {
    const stable = pushStableFrames(63, 16);
    const invalidated = pushFrameSkippingSample(stable.state, stable.timestamp);

    expect(invalidated.ready).toBe(false);
    expect(invalidated.frameOrdinal).toBeNull();
  });
});
