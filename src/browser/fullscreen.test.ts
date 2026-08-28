import { describe, expect, it, vi } from 'vitest';
import { createFullscreenHelper, type FullscreenEnvironment } from './fullscreen';

describe('Fullscreen helper', () => {
  it('confirms entry from actual fullscreen state', async () => {
    const element = {} as HTMLElement;
    let active: Element | null = null;
    const environment: FullscreenEnvironment = {
      isEnabled: () => true,
      getFullscreenElement: () => active,
      request: async (requested) => { active = requested; },
      exit: async () => { active = null; },
      setChangeListener: () => undefined,
    };
    const helper = createFullscreenHelper(environment);
    await expect(helper.request(element)).resolves.toBe(true);
    await expect(helper.exit()).resolves.toBe(true);
  });

  it('does not report success when request resolves without fullscreen state', async () => {
    const environment: FullscreenEnvironment = {
      isEnabled: () => true,
      getFullscreenElement: () => null,
      request: async () => undefined,
      exit: async () => undefined,
      setChangeListener: () => undefined,
    };
    await expect(createFullscreenHelper(environment).request({} as HTMLElement)).resolves.toBe(false);
  });

  it('handles rejection and unsupported state without throwing', async () => {
    const environment: FullscreenEnvironment = {
      isEnabled: () => false,
      getFullscreenElement: () => null,
      request: async () => { throw new Error('denied'); },
      exit: async () => { throw new Error('denied'); },
      setChangeListener: () => undefined,
    };
    const helper = createFullscreenHelper(environment);
    expect(helper.isSupported()).toBe(false);
    await expect(helper.request({} as HTMLElement)).resolves.toBe(false);
  });

  it('observes state changes only while subscribed and cleans up', () => {
    let changeListener: (() => void) | null = null;
    const environment: FullscreenEnvironment = {
      isEnabled: () => true,
      getFullscreenElement: () => null,
      request: async () => undefined,
      exit: async () => undefined,
      setChangeListener: (listener) => { changeListener = listener; },
    };
    const helper = createFullscreenHelper(environment);
    const listener = vi.fn();
    const unsubscribe = helper.subscribe(listener);
    changeListener?.();
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    expect(changeListener).toBeNull();
    helper.destroy();
  });
});
