import { expect, test } from '@playwright/test';

import { Map } from './model/map';

test.describe('check map rendering', () => {
  let mapPage: Map;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`🛠️  Running ${testInfo.title}`);
    mapPage = new Map(page);
    await mapPage.goto();
    await mapPage.waitForIdle();
  });

  test('test population reference layer', async ({ page }) => {
    await mapPage.testPopulationLayer();
    const screenshot = await page.screenshot();
    expect(
      expect(screenshot).toMatchSnapshot(['screenshots', 'default.png'], { maxDiffPixelRatio: 0.1 }),
    ).not.toBeTruthy();
  });

  test('test green space reference layer', async ({ page }) => {
    await mapPage.testGreenSpaceLayer();
    const screenshot = await page.screenshot();
    expect(
      expect(screenshot).toMatchSnapshot(['screenshots', 'default.png'], { maxDiffPixelRatio: 0.1 }),
    ).not.toBeTruthy();
  });

  test('test impervious area reference layer', async ({ page }) => {
    await mapPage.testImperviousAreaLayer();
    const screenshot = await page.screenshot();
    expect(
      expect(screenshot).toMatchSnapshot(['screenshots', 'default.png'], { maxDiffPixelRatio: 0.1 }),
    ).not.toBeTruthy();
  });
});
