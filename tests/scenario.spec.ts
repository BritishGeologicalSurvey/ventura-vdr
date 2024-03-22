import { expect, test } from '@playwright/test';

import { Scenario } from './model/scenario';

test.describe('create new scenario', () => {
  let scenarioPage: Scenario;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`🛠️  Running ${testInfo.title}`);
    scenarioPage = new Scenario(page);
    await scenarioPage.goto();
  });

  test('open create scenario dialog', async ({ page }) => {
    await scenarioPage.openDialog();
    await expect(page.getByText('Select Catchments')).toBeVisible();
  });

  test('select catchments on map', async ({ page }) => {
    await scenarioPage.openDialog();
    await scenarioPage.selectCatchments();
    await expect(page.getByText('Edit selected catchment(s)')).toBeVisible();
  });

  test('edit catchment values', async ({ page }) => {
    await scenarioPage.openDialog();
    await scenarioPage.selectCatchments();
    await scenarioPage.editCatchments();
    await expect(page.getByText('Review selected catchment(s)')).toBeVisible();
  });

  test('view results', async ({ page }) => {
    await scenarioPage.openDialog();
    await scenarioPage.selectCatchments();
    await scenarioPage.editCatchments();
    await scenarioPage.viewResults();
    await expect(page.locator('.mat-mdc-select-min-line')).toHaveText('Test');
  });
});
