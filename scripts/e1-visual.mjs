import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const viewports = [
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

await fs.mkdir('visual-output', { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto('http://127.0.0.1:4173/mouse-tester/', { waitUntil: 'networkidle' });

    const surface = page.locator('[data-mouse-test-surface]');
    const box = await surface.boundingBox();
    assert.ok(box, 'Mouse Tester surface must have a bounding box');

    await page.mouse.move(box.x + box.width * 0.42, box.y + box.height * 0.45);
    await page.mouse.move(box.x + box.width * 0.48, box.y + box.height * 0.48);
    await page.mouse.wheel(0, -120);

    await surface.evaluate((element) => {
      const emit = (type, button) => {
        const event = new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          pointerType: 'mouse',
          button,
        });
        (type === 'pointerdown' ? element : window).dispatchEvent(event);
      };
      emit('pointerdown', 0);
      emit('pointerup', 0);
      emit('pointerdown', 3);
      emit('pointerup', 3);
    });

    assert.equal(await page.locator('[data-mouse-status]').textContent(), 'Input detected');
    assert.equal(await page.locator('[data-mouse-button-count="0"]').textContent(), '1');
    assert.equal(await page.locator('[data-mouse-button-count="3"]').textContent(), '1');
    assert.equal(await page.locator('[data-mouse-wheel]').textContent(), 'Up');
    assert.equal(await page.locator('[data-mouse-movement]').textContent(), 'Detected');

    const metrics = await page.evaluate(() => {
      const tool = document.querySelector('.tool-shell');
      const rect = tool?.getBoundingClientRect();
      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        pageScrollWidth: document.documentElement.scrollWidth,
        pageClientWidth: document.documentElement.clientWidth,
        toolTop: rect?.top ?? null,
        toolBottom: rect?.bottom ?? null,
        toolHeight: rect?.height ?? null,
      };
    });

    assert.ok(metrics.pageScrollWidth <= metrics.pageClientWidth, 'Page must not overflow horizontally');
    if (viewport.width >= 1366) {
      assert.ok((metrics.toolBottom ?? Infinity) <= viewport.height, 'Desktop tool must fit one viewport');
    }

    await fs.writeFile(
      `visual-output/mouse-tester-${viewport.width}x${viewport.height}.json`,
      JSON.stringify(metrics, null, 2),
    );
    await page.screenshot({
      path: `visual-output/mouse-tester-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
    await page.close();
  }
} finally {
  await browser.close();
}
