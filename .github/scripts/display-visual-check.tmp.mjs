import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const browserPath = process.env.BROWSER;
if (!browserPath) {
  throw new Error('BROWSER environment variable is required');
}

const outputDir = 'visual-check';
await mkdir(outputDir, { recursive: true });

const debugPort = 9222;
const profileDir = `/tmp/display-visual-check-${Date.now()}`;
const browser = spawn(
  browserPath,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'inherit'] },
);

const getPageTarget = async () => {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
      if (page) {
        return page;
      }
    } catch {
      // Chrome may not have opened its debugging endpoint yet.
    }
    await sleep(100);
  }

  throw new Error('Could not connect to the Chrome DevTools endpoint');
};

const target = await getPageTarget();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const eventWaiters = new Map();

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.id !== undefined) {
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
    return;
  }

  if (!message.method) return;
  const waiters = eventWaiters.get(message.method) ?? [];
  eventWaiters.delete(message.method);
  waiters.forEach((resolve) => resolve(message.params));
});

const command = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

const nextEvent = (method) =>
  new Promise((resolve) => {
    const waiters = eventWaiters.get(method) ?? [];
    waiters.push(resolve);
    eventWaiters.set(method, waiters);
  });

await command('Page.enable');
await command('Runtime.enable');

const checks = [
  { route: 'fps-test', expectedStatus: 'Measuring live', resultSelector: '[data-fps-result]' },
  {
    route: 'refresh-rate-test',
    expectedStatus: 'Estimating live',
    resultSelector: '[data-refresh-result]',
  },
];

const viewports = [
  { width: 1366, height: 768, label: '1366x768' },
  { width: 1440, height: 900, label: '1440x900' },
  { width: 390, height: 844, label: '390x844' },
];

try {
  for (const check of checks) {
    for (const viewport of viewports) {
      await command('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: false,
      });

      const loaded = nextEvent('Page.loadEventFired');
      await command('Page.navigate', {
        url: `http://127.0.0.1:4321/${check.route}/`,
      });
      await loaded;
      await sleep(3000);

      const state = await command('Runtime.evaluate', {
        expression: `JSON.stringify({
          visibility: document.visibilityState,
          status: document.querySelector('[data-display-status]')?.textContent?.trim() ?? null,
          result: document.querySelector(${JSON.stringify(check.resultSelector)})?.textContent?.trim() ?? null,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        })`,
        returnByValue: true,
      });

      const parsed = JSON.parse(state.result.value);
      console.log(`${check.route} ${viewport.label}: ${JSON.stringify(parsed)}`);

      if (parsed.visibility !== 'visible') {
        throw new Error(`${check.route} ${viewport.label}: page is not visible`);
      }
      if (parsed.status !== check.expectedStatus) {
        throw new Error(
          `${check.route} ${viewport.label}: expected ${check.expectedStatus}, got ${parsed.status}`,
        );
      }
      if (!parsed.result || parsed.result === '—') {
        throw new Error(`${check.route} ${viewport.label}: live result was not produced`);
      }
      if (parsed.scrollWidth > parsed.clientWidth) {
        throw new Error(`${check.route} ${viewport.label}: horizontal overflow detected`);
      }

      const screenshot = await command('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
      });
      await writeFile(
        `${outputDir}/${check.route}-${viewport.label}.png`,
        Buffer.from(screenshot.data, 'base64'),
      );
    }
  }
} finally {
  socket.close();
  browser.kill('SIGTERM');
}
