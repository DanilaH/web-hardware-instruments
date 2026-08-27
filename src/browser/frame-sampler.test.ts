import { describe, expect, it } from 'vitest';

import {
  createFrameSampler,
  type FrameSamplerEnvironment,
  type FrameSamplerEvent,
} from './frame-sampler';

const createEnvironment = (initialVisibility: DocumentVisibilityState = 'visible') => {
  let visibility = initialVisibility;
  let nextFrame = 1;
  const frames = new Map<number, FrameRequestCallback>();
  const cancelledFrames: number[] = [];
  const visibilityListeners = new Set<() => void>();

  const environment: FrameSamplerEnvironment = {
    requestFrame: (callback) => {
      const handle = nextFrame++;
      frames.set(handle, callback);
      return handle;
    },
    cancelFrame: (handle) => {
      cancelledFrames.push(handle);
      frames.delete(handle);
    },
    getVisibilityState: () => visibility,
    addVisibilityListener: (listener) => visibilityListeners.add(listener),
    removeVisibilityListener: (listener) => visibilityListeners.delete(listener),
  };

  return {
    environment,
    frames,
    cancelledFrames,
    visibilityListeners,
    setVisibility(nextVisibility: DocumentVisibilityState) {
      visibility = nextVisibility;
      visibilityListeners.forEach((listener) => listener());
    },
    runFrame(handle: number, timestamp: number) {
      const callback = frames.get(handle);
      if (!callback) {
        throw new Error(`Missing frame ${handle}`);
      }
      frames.delete(handle);
      callback(timestamp);
    },
  };
};

describe('FrameSampler', () => {
  it('uses one rAF loop and forwards the callback timestamp unchanged', () => {
    const fixture = createEnvironment();
    const sampler = createFrameSampler(fixture.environment);
    const events: FrameSamplerEvent[] = [];
    sampler.subscribe((event) => events.push(event));

    expect(sampler.start()).toBe(true);
    expect(fixture.frames.size).toBe(1);

    const firstHandle = [...fixture.frames.keys()][0];
    expect(firstHandle).toBeDefined();
    fixture.runFrame(firstHandle!, 123.45);

    expect(events).toEqual([{ type: 'sample', timestamp: 123.45 }]);
    expect(fixture.frames.size).toBe(1);
  });

  it('keeps repeated start calls idempotent with one loop and one listener', () => {
    const fixture = createEnvironment();
    const sampler = createFrameSampler(fixture.environment);

    expect(sampler.start()).toBe(true);
    expect(sampler.start()).toBe(true);
    expect(sampler.start()).toBe(true);

    expect(fixture.frames.size).toBe(1);
    expect(fixture.visibilityListeners.size).toBe(1);
  });

  it('emits one reset on visibility loss, cancels sampling, and resumes cleanly', () => {
    const fixture = createEnvironment();
    const sampler = createFrameSampler(fixture.environment);
    const events: FrameSamplerEvent[] = [];
    sampler.subscribe((event) => events.push(event));

    sampler.start();
    expect(fixture.frames.size).toBe(1);

    fixture.setVisibility('hidden');
    expect(events).toEqual([{ type: 'reset' }]);
    expect(fixture.frames.size).toBe(0);
    expect(fixture.cancelledFrames.length).toBe(1);

    fixture.setVisibility('hidden');
    expect(events).toEqual([{ type: 'reset' }]);

    fixture.setVisibility('visible');
    expect(fixture.frames.size).toBe(1);

    const resumedHandle = [...fixture.frames.keys()][0];
    expect(resumedHandle).toBeDefined();
    fixture.runFrame(resumedHandle!, 500);
    expect(events).toEqual([{ type: 'reset' }, { type: 'sample', timestamp: 500 }]);
  });

  it('does not emit a hidden-tab sample if visibility changes before the callback runs', () => {
    const fixture = createEnvironment();
    const sampler = createFrameSampler(fixture.environment);
    const events: FrameSamplerEvent[] = [];
    sampler.subscribe((event) => events.push(event));

    sampler.start();
    const handle = [...fixture.frames.keys()][0];
    expect(handle).toBeDefined();

    fixture.visibilityListeners.clear();
    fixture.setVisibility('hidden');
    fixture.runFrame(handle!, 16.7);

    expect(events).toEqual([{ type: 'reset' }]);
    expect(fixture.frames.size).toBe(0);
  });

  it('can start while hidden and begins sampling only after becoming visible', () => {
    const fixture = createEnvironment('hidden');
    const sampler = createFrameSampler(fixture.environment);
    const events: FrameSamplerEvent[] = [];
    sampler.subscribe((event) => events.push(event));

    expect(sampler.start()).toBe(true);
    expect(fixture.frames.size).toBe(0);
    expect(events).toEqual([]);

    fixture.setVisibility('visible');
    expect(fixture.frames.size).toBe(1);
    expect(events).toEqual([]);
  });

  it('stop keeps the sampler reusable while destroy permanently disposes it', () => {
    const fixture = createEnvironment();
    const sampler = createFrameSampler(fixture.environment);

    sampler.start();
    sampler.stop();
    expect(fixture.frames.size).toBe(0);
    expect(fixture.visibilityListeners.size).toBe(0);

    expect(sampler.start()).toBe(true);
    expect(fixture.frames.size).toBe(1);

    sampler.destroy();
    sampler.destroy();
    expect(fixture.frames.size).toBe(0);
    expect(fixture.visibilityListeners.size).toBe(0);
    expect(sampler.start()).toBe(false);
  });
});
