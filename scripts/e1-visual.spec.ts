import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const viewports = [
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  test(`Mouse Tester ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:4173/mouse-tester/');
    await page.waitForLoadState('networkidle');

    const surface = page.locator('[data-mouse-test-surface]');
    const box = await surface.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width * 0.42, box.y + box.height * 0.45);
    await page.mouse.move(box.x + box.width * 0.48, box.y + box.height * 0.48);
    await page.mouse.wheel(0, -120);

    await surface.evaluate((element) => {
      const emit = (type: 'pointerdown' | 'pointerup', button: number) => {
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

    await expect(page.locator('[data-mouse-status]')).toHaveText('Input detected');
    await expect(page.locator('[data-mouse-button-count="0"]')).toHaveText('1');
    await expect(page.locator('[data-mouse-button-count="3"]')).toHaveText('1');
    await expect(page.locator('[data-mouse-wheel]')).toHaveText('Up');
    await expect(page.locator('[data-mouse-movement]')).toHaveText('Detected');

    const metrics = await page.evaluate(() => {
      const tool = document.querySelector<HTMLElement>('.tool-shell');
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

    expect(metrics.pageScrollWidth).toBeLessThanOrEqual(metrics.pageClientWidth);
    if (viewport.width >= 1366) {
      expect(metrics.toolBottom ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(viewport.height);
    }

    await fs.mkdir('visual-output', { recursive: true });
    await fs.writeFile(
      `visual-output/mouse-tester-${viewport.width}x${viewport.height}.json`,
      JSON.stringify(metrics, null, 2),
    );
    await page.screenshot({
      path: `visual-output/mouse-tester-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
  });
}
