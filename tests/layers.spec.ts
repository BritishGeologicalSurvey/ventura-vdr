import { test } from '@playwright/test';

import { Layers } from './model/layers';

test.describe('check loading of layers', () => {
  let layersPage: Layers;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`🛠️  Running ${testInfo.title}`);
    layersPage = new Layers(page);
    await layersPage.goto();
  });

  test('load rivers layer', async () => {
    await layersPage.loadRiversLayer();
  });

  test('load LPAs layer', async () => {
    await layersPage.loadLPALayer();
  });

  test('load WWTP layer', async () => {
    await layersPage.loadWWTPLayer();
  });
});
