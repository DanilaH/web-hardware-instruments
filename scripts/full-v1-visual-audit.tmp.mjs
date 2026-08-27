import { mkdirSync, writeFileSync } from 'node:fs';

const CDP_BASE = 'http://127.0.0.1:9222';
const SITE_BASE = 'http://127.0.0.1:4321';
const OUT_DIR = 'artifacts/full-v1-visual-audit';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForChrome() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`${CDP_BASE}/json/version`);
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome DevTools endpoint did not become ready');
}

class CdpPage {
  constructor(wsUrl) {
    this.socket = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });

    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result ?? {});
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text ?? 'Runtime evaluation failed');
    }
    return result.result?.value;
  }

  close() {
    this.socket.close();
  }
}

const gamepadBootstrap = (axes) => `
  (() => {
    const fake = {
      id: 'visual-audit-private-id',
      index: 0,
      connected: true,
      mapping: 'standard',
      timestamp: 1,
      axes: ${JSON.stringify(axes)},
      buttons: Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 })),
      vibrationActuator: null,
      hapticActuators: []
    };
    Object.defineProperty(window, '__visualAuditGamepad', { value: fake, configurable: true });
    Object.defineProperty(navigator, 'getGamepads', {
      configurable: true,
      value: () => [fake]
    });
  })();
`;

const mouseBootstrap = `
  (() => {
    Object.defineProperty(HTMLElement.prototype, 'requestPointerLock', {
      configurable: true,
      value: undefined
    });
  })();
`;

const cases = [
  { slug: 'gamepad-tester', root: '[data-gamepad-tester]', bootstrap: gamepadBootstrap([0.35, -0.2, -0.4, 0.25]) },
  { slug: 'controller-stick-drift-test', root: '[data-stick-drift-test]', bootstrap: gamepadBootstrap([0.038, 0, 0.009, 0]), action: 'drift' },
  { slug: 'controller-deadzone-test', root: '[data-controller-deadzone-test]', bootstrap: gamepadBootstrap([0.027, 0, 0, 0]), action: 'deadzone' },
  { slug: 'fps-test', root: '[data-fps-test]', action: 'display' },
  { slug: 'refresh-rate-test', root: '[data-refresh-rate-test]', action: 'display' },
  { slug: 'mouse-dpi-test', root: '[data-mouse-dpi-test]', bootstrap: mouseBootstrap, action: 'mouse' },
  { slug: 'keyboard-tester', root: '[data-keyboard-tester]', action: 'keyboard' },
];

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
];

async function createPage() {
  const response = await fetch(`${CDP_BASE}/json/new?about:blank`, { method: 'PUT' });
  if (!response.ok) throw new Error(`Could not create Chrome target: ${response.status}`);
  const target = await response.json();
  const page = new CdpPage(target.webSocketDebuggerUrl);
  await page.open();
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  return page;
}

async function prepareState(page, testCase) {
  if (testCase.action === 'drift') {
    await page.evaluate(`document.querySelector('[data-drift-start]')?.click()`);
    await sleep(3400);
  } else if (testCase.action === 'deadzone') {
    await page.evaluate(`document.querySelector('[data-deadzone-start]')?.click()`);
    await sleep(3400);
  } else if (testCase.action === 'display') {
    await sleep(3000);
  } else if (testCase.action === 'mouse') {
    await page.evaluate(`document.querySelector('[data-mouse-dpi-form]')?.requestSubmit()`);
    await sleep(200);
    await page.evaluate(`
      (() => {
        for (const delta of [120, 140, 160, 180]) {
          const event = new MouseEvent('mousemove', { bubbles: true });
          Object.defineProperty(event, 'movementX', { value: delta });
          Object.defineProperty(event, 'movementY', { value: 0 });
          document.dispatchEvent(event);
        }
        document.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
      })();
    `);
    await sleep(250);
  } else if (testCase.action === 'keyboard') {
    await page.send('Input.dispatchKeyEvent', {
      type: 'rawKeyDown', key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65,
    });
    await sleep(150);
  } else {
    await sleep(700);
  }
}

async function capture(testCase, viewport) {
  const page = await createPage();
  try {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false,
    });

    if (testCase.bootstrap) {
      await page.send('Page.addScriptToEvaluateOnNewDocument', { source: testCase.bootstrap });
    }

    await page.send('Page.navigate', { url: `${SITE_BASE}/${testCase.slug}` });
    await sleep(900);
    await prepareState(page, testCase);

    const metrics = await page.evaluate(`
      (() => {
        const root = document.querySelector(${JSON.stringify(testCase.root)});
        const rect = root?.closest('.tool-shell')?.getBoundingClientRect() ?? root?.getBoundingClientRect();
        return {
          route: location.pathname,
          viewport: { width: innerWidth, height: innerHeight },
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
          rootRect: rect ? { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height } : null,
          state: root?.getAttribute('data-state') ?? null,
          bodyText: document.body.innerText.slice(0, 600)
        };
      })();
    `);

    if (!metrics.rootRect) throw new Error(`${testCase.slug}: primary tool not found`);
    if (metrics.scrollWidth > viewport.width + 1) {
      throw new Error(`${testCase.slug} ${viewport.name}: horizontal overflow ${metrics.scrollWidth} > ${viewport.width}`);
    }
    if (viewport.width >= 1366 && metrics.rootRect.bottom > viewport.height + 1) {
      throw new Error(`${testCase.slug} ${viewport.name}: primary tool bottom ${metrics.rootRect.bottom} exceeds viewport ${viewport.height}`);
    }

    const shot = await page.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const filename = `${OUT_DIR}/${testCase.slug}-${viewport.name}.png`;
    writeFileSync(filename, Buffer.from(shot.data, 'base64'));
    return metrics;
  } finally {
    page.close();
  }
}

await waitForChrome();
mkdirSync(OUT_DIR, { recursive: true });
const report = [];

for (const testCase of cases) {
  for (const viewport of viewports) {
    const metrics = await capture(testCase, viewport);
    report.push(metrics);
    console.log(JSON.stringify(metrics));
  }
}

writeFileSync(`${OUT_DIR}/metrics.json`, JSON.stringify(report, null, 2));
