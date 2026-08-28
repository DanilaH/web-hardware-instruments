import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const viewports = [
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

const routes = [
  'mouse-button-test',
  'mouse-scroll-test',
  'double-click-test',
  'mouse-polling-rate-test',
];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH,
});
await fs.mkdir('visual-output', { recursive: true });

const emitPointer = async (page, selector, type, button) => {
  await page.locator(selector).evaluate((element, payload) => {
    element.dispatchEvent(new PointerEvent(payload.type, {
      bubbles: true,
      cancelable: true,
      pointerType: 'mouse',
      button: payload.button,
    }));
  }, { type, button });
};

try {
  for (const route of routes) {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      await page.goto(`http://127.0.0.1:4173/${route}/`, { waitUntil: 'networkidle' });

      if (route === 'mouse-button-test') {
        await emitPointer(page, '[data-mouse-button-surface]', 'pointerdown', 0);
        await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse', button: 0 })));
        await emitPointer(page, '[data-mouse-button-surface]', 'pointerdown', 3);
        await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse', button: 3 })));
        assert.equal(await page.locator('[data-button-count]').first().textContent(), '1');
      }

      if (route === 'mouse-scroll-test') {
        const surface = page.locator('[data-scroll-surface]');
        await surface.evaluate((element) => {
          for (const [dx, dy] of [[0, -120], [0, -120], [0, 120], [90, 5]]) {
            element.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaX: dx, deltaY: dy, deltaMode: 0 }));
          }
        });
        assert.equal(await page.locator('[data-scroll-up]').textContent(), '2');
        assert.equal(await page.locator('[data-scroll-down]').textContent(), '1');
        assert.equal(await page.locator('[data-scroll-horizontal]').textContent(), '1');
      }

      if (route === 'double-click-test') {
        await emitPointer(page, '[data-double-surface]', 'pointerdown', 0);
        await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse', button: 0 })));
        await page.waitForTimeout(20);
        await emitPointer(page, '[data-double-surface]', 'pointerdown', 0);
        await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse', button: 0 })));
        assert.equal(await page.locator('[data-double-total]').textContent(), '2');
        assert.equal(await page.locator('[data-double-status]').textContent(), 'Rapid repeat observed');
      }

      if (route === 'mouse-polling-rate-test') {
        const field = page.locator('[data-polling-surface]');
        const box = await field.boundingBox();
        assert.ok(box, 'Polling movement field must have a bounding box');
        await page.locator('[data-polling-start]').click();
        const end = Date.now() + 2150;
        let step = 0;
        while (Date.now() < end) {
          const x = box.x + 12 + ((step * 17) % Math.max(20, box.width - 24));
          const y = box.y + box.height * (0.35 + (step % 3) * 0.12);
          await page.mouse.move(x, y);
          await page.waitForTimeout(4);
          step += 1;
        }
        await page.waitForTimeout(150);
        const pollingStatus = await page.locator('[data-polling-status]').textContent();
        assert.ok(['Measurement complete', 'Not enough movement — try again.'].includes(pollingStatus ?? ''));
      }

      const metrics = await page.evaluate(() => {
        const tool = document.querySelector('.tool-shell');
        const rect = tool?.getBoundingClientRect();
        return {
          pageScrollWidth: document.documentElement.scrollWidth,
          pageClientWidth: document.documentElement.clientWidth,
          toolTop: rect?.top ?? null,
          toolBottom: rect?.bottom ?? null,
          toolHeight: rect?.height ?? null,
        };
      });

      assert.ok(metrics.pageScrollWidth <= metrics.pageClientWidth, `${route} must not overflow horizontally`);
      if (viewport.width >= 1366) {
        assert.ok((metrics.toolBottom ?? Infinity) <= viewport.height, `${route} must fit 1366+ desktop viewport`);
      }

      await fs.writeFile(`visual-output/${route}-${viewport.width}x${viewport.height}.json`, JSON.stringify(metrics, null, 2));
      await page.screenshot({ path: `visual-output/${route}-${viewport.width}x${viewport.height}.png`, fullPage: true });
      await page.close();
    }
  }
} finally {
  await browser.close();
}
