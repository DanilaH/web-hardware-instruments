import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const browserPath = process.env.BROWSER;
if (!browserPath) throw new Error('BROWSER is required');

await mkdir('visual-check', { recursive: true });
const port = 9222;
const browser = spawn(browserPath, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=/tmp/mouse-dpi-review-${Date.now()}`,
  'about:blank',
], { stdio: ['ignore', 'ignore', 'inherit'] });

const getTarget = async () => {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json`);
      const targets = await response.json();
      const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
      if (target) return target;
    } catch {}
    await sleep(100);
  }
  throw new Error('Could not connect to Chrome');
};

const target = await getTarget();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const waiters = new Map();
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
  const listeners = waiters.get(message.method) ?? [];
  waiters.delete(message.method);
  listeners.forEach((resolve) => resolve(message.params));
});

const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const nextEvent = (method) => new Promise((resolve) => {
  const listeners = waiters.get(method) ?? [];
  listeners.push(resolve);
  waiters.set(method, listeners);
});
const evaluate = async (expression) => {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true });
  return result.result.value;
};
const screenshot = async (name) => {
  const result = await command('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile(`visual-check/${name}.png`, Buffer.from(result.data, 'base64'));
};
const navigate = async (width, height) => {
  await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  const loaded = nextEvent('Page.loadEventFired');
  await command('Page.navigate', { url: 'http://127.0.0.1:4321/mouse-dpi-test/' });
  await loaded;
  await sleep(150);
};

await command('Page.enable');
await command('Runtime.enable');

try {
  for (const [width, height] of [[1366, 768], [1440, 900], [390, 844]]) {
    await navigate(width, height);
    const metrics = JSON.parse(await evaluate(`JSON.stringify({
      status: document.querySelector('[data-mouse-status]')?.textContent?.trim(),
      rootBottom: document.querySelector('[data-mouse-dpi-test]')?.getBoundingClientRect().bottom,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      viewportHeight: window.innerHeight
    })`));
    console.log(`${width}x${height}:`, JSON.stringify(metrics));
    if (metrics.status !== 'Ready') throw new Error(`Unexpected status at ${width}x${height}`);
    if (metrics.scrollWidth > metrics.clientWidth) throw new Error(`Horizontal overflow at ${width}x${height}`);
    if (width >= 1366 && metrics.rootBottom > metrics.viewportHeight + 1) {
      throw new Error(`Primary mouse tool does not fit ${width}x${height}: ${metrics.rootBottom} > ${metrics.viewportHeight}`);
    }
    await screenshot(`mouse-dpi-${width}x${height}`);
  }
} finally {
  socket.close();
  browser.kill('SIGTERM');
}
