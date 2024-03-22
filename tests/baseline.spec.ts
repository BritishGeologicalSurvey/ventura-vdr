import { expect, test } from '@playwright/test';

import { Baseline } from './model/baseline';

test.describe('check baseline data', () => {
  let baselinePage: Baseline;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`🛠️  Running ${testInfo.title}`);
    baselinePage = new Baseline(page);
    await baselinePage.goto();
    await baselinePage.waitForCanvas();
  });

  test('check initial water flow value', async ({ page }) => {
    await baselinePage.checkWaterFlowValue();
    await expect(page.locator('.table-auto > tbody:nth-child(2) > tr:nth-child(4) > td:nth-child(2)')).toHaveText(
      '140900 m3/day to 4 s.f',
    );
  });

  test('check initial excess water value', async ({ page }) => {
    await baselinePage.checkExcessWaterValue();
    await expect(page.locator('.table-auto > tbody:nth-child(2) > tr:nth-child(3) > td:nth-child(2)')).toHaveText(
      '36330 m3/day to 4 s.f',
    );
  });

  test('check initial water quality value', async ({ page }) => {
    await baselinePage.checkWaterQualityValue();
    await expect(page.locator('.table-auto > tbody:nth-child(2) > tr:nth-child(4) > td:nth-child(2)')).toHaveText(
      '857.81 µg/l to 5 s.f',
    );
  });

  test('check baseline + intervention', async ({ page }) => {
    await page.getByRole('button', { name: 'Baseline + Intervention' }).click();
    await expect(page.getByRole('button', { name: '140900' })).toBeVisible();
  });

  test('check intervention + future', async ({ page }) => {
    await page.getByRole('button', { name: 'Intervention + Future' }).click();
    await expect(page.getByRole('button', { name: '257900' })).toBeVisible();
  });

  test('open table view', async ({ page }) => {
    await baselinePage.openTableView();
    await expect(page.getByRole('button', { name: 'Outlets' })).toBeVisible();
  });
});
