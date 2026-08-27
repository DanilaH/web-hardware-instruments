import { describe, expect, it } from 'vitest';

import {
  createKeyboardInputService,
  type KeyboardInputServiceEnvironment,
  type KeyboardInputServiceEvent,
} from './keyboard-input-service';

const createEnvironment = () => {
  let visibility: DocumentVisibilityState = 'visible';
  let keydownListener: ((code: string, key: string, repeat: boolean) => void) | null = null;
  let keyupListener: ((code: string, key: string) => void) | null = null;
  let blurListener: (() => void) | null = null;
  let visibilityListener: (() => void) | null = null;

  const environment: KeyboardInputServiceEnvironment = {
    setKeydownListener: (listener) => {
      keydownListener = listener;
    },
    setKeyupListener: (listener) => {
      keyupListener = listener;
    },
    setBlurListener: (listener) => {
      blurListener = listener;
    },
    setVisibilityListener: (listener) => {
      visibilityListener = listener;
    },
    getVisibilityState: () => visibility,
  };

  return {
    environment,
    keydown(code: string, key: string, repeat = false) {
      keydownListener?.(code, key, repeat);
    },
    keyup(code: string, key: string) {
      keyupListener?.(code, key);
    },
    blur() {
      blurListener?.();
    },
    hide() {
      visibility = 'hidden';
      visibilityListener?.();
    },
    show() {
      visibility = 'visible';
      visibilityListener?.();
    },
    listenerCount() {
      return [keydownListener, keyupListener, blurListener, visibilityListener].filter(Boolean).length;
    },
  };
};

describe('KeyboardInputService', () => {
  it('emits normalized keydown and keyup events including repeat state', () => {
    const fixture = createEnvironment();
    const service = createKeyboardInputService(fixture.environment);
    const events: KeyboardInputServiceEvent[] = [];
    service.subscribe((event) => events.push(event));

    expect(service.start()).toBe(true);
    fixture.keydown('KeyA', 'a');
    fixture.keydown('KeyA', 'a', true);
    fixture.keyup('KeyA', 'a');

    expect(events).toEqual([
      { type: 'keydown', code: 'KeyA', key: 'a', repeat: false },
      { type: 'keydown', code: 'KeyA', key: 'a', repeat: true },
      { type: 'keyup', code: 'KeyA', key: 'a' },
    ]);
  });

  it('emits clear only when blur or hidden visibility invalidates pressed state', () => {
    const fixture = createEnvironment();
    const service = createKeyboardInputService(fixture.environment);
    const events: KeyboardInputServiceEvent[] = [];
    service.subscribe((event) => events.push(event));

    service.start();
    fixture.show();
    fixture.blur();
    fixture.hide();

    expect(events).toEqual([
      { type: 'clear', reason: 'blur' },
      { type: 'clear', reason: 'visibility-hidden' },
    ]);
  });

  it('start is idempotent and stop can be followed by a clean restart', () => {
    const fixture = createEnvironment();
    const service = createKeyboardInputService(fixture.environment);

    expect(service.start()).toBe(true);
    expect(service.start()).toBe(true);
    expect(fixture.listenerCount()).toBe(4);

    service.stop();
    expect(fixture.listenerCount()).toBe(0);

    expect(service.start()).toBe(true);
    expect(fixture.listenerCount()).toBe(4);
  });

  it('destroy is idempotent, permanent, and clears runtime listeners', () => {
    const fixture = createEnvironment();
    const service = createKeyboardInputService(fixture.environment);
    const events: KeyboardInputServiceEvent[] = [];
    service.subscribe((event) => events.push(event));

    service.start();
    service.destroy();
    service.destroy();
    fixture.keydown('KeyA', 'a');

    expect(fixture.listenerCount()).toBe(0);
    expect(events).toEqual([]);
    expect(service.start()).toBe(false);
  });

  it('gracefully reports unavailable browser environment', () => {
    const service = createKeyboardInputService(null);
    expect(service.start()).toBe(false);
  });
});
