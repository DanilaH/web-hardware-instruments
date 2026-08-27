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
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=/tmp/display-review-${Date.now()}`,
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
const navigate = async (url, width, height) => {
  await command('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  const loaded = nextEvent('Page.loadEventFired');
  await command('Page.navigate', { url });
  await loaded;
};

await command('Page.enable');
await command('Runtime.enable');

try {
  await navigate('http://127.0.0.1:4321/refresh-rate-test/', 390, 844);
  await sleep(100);
  const warming = JSON.parse(await evaluate(`JSON.stringify({
    status: document.querySelector('[data-display-status]')?.textContent?.trim(),
    resultRowHeight: document.querySelector('.refresh-result-row')?.getBoundingClientRect().height,
    cadenceTop: document.querySelector('.cadence-panel')?.getBoundingClientRect().top,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  })`));
  await screenshot('refresh-mobile-warming');

  await sleep(3000);
  const live = JSON.parse(await evaluate(`JSON.stringify({
    status: document.querySelector('[data-display-status]')?.textContent?.trim(),
    result: document.querySelector('[data-refresh-result]')?.textContent?.trim(),
    commonMode: document.querySelector('[data-common-mode]')?.textContent?.trim(),
    resultRowHeight: document.querySelector('.refresh-result-row')?.getBoundingClientRect().height,
    cadenceTop: document.querySelector('.cadence-panel')?.getBoundingClientRect().top,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  })`));
  await screenshot('refresh-mobile-live');

  console.log('refresh warming:', JSON.stringify(warming));
  console.log('refresh live:', JSON.stringify(live));

  if (warming.status !== 'Warming up') throw new Error(`Expected warming state, got ${warming.status}`);
  if (live.status !== 'Estimating live' || !live.result || live.result === '—') {
    throw new Error(`Expected live refresh result, got ${JSON.stringify(live)}`);
  }
  if (Math.abs(warming.resultRowHeight - live.resultRowHeight) > 1) {
    throw new Error(`Refresh result row shifted: ${warming.resultRowHeight} -> ${live.resultRowHeight}`);
  }
  if (Math.abs(warming.cadenceTop - live.cadenceTop) > 1) {
    throw new Error(`Refresh cadence panel shifted: ${warming.cadenceTop} -> ${live.cadenceTop}`);
  }
  if (live.scrollWidth > live.clientWidth) throw new Error('Refresh mobile horizontal overflow');

  await navigate('http://127.0.0.1:4321/fps-test/', 1366, 768);
  await sleep(3000);
  const fps = JSON.parse(await evaluate(`JSON.stringify({
    status: document.querySelector('[data-display-status]')?.textContent?.trim(),
    result: document.querySelector('[data-fps-result]')?.textContent?.trim(),
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  })`));
  await screenshot('fps-desktop-live');
  console.log('fps live:', JSON.stringify(fps));
  if (fps.status !== 'Measuring live' || !fps.result || fps.result === '—') {
    throw new Error(`Expected live FPS result, got ${JSON.stringify(fps)}`);
  }
  if (fps.scrollWidth > fps.clientWidth) throw new Error('FPS desktop horizontal overflow');
} finally {
  socket.close();
  browser.kill('SIGTERM');
}
