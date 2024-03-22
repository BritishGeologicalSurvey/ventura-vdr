import { expect, test } from '@playwright/test';

test('app builds and launches', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.title')).toHaveText('Prototype Virtual Decision Room');
});

test('open the vdr tool', async ({ page }) => {
  await page.goto('/');
  await page.locator('#open-vdr').click();
  expect(page.url()).toBe('http://localhost:4200/vdr');
});

test('navigate to settings page', async ({ page }) => {
  await page.goto('/');
  await page.locator('#settings').click();
  expect(page.url()).toBe('http://localhost:4200/settings');
});

test('navigate to about page', async ({ page }) => {
  await page.goto('/');
  await page.locator('#about').click();
  expect(page.url()).toBe('http://localhost:4200/about');
});

test('navigate to systems thinking page', async ({ page }) => {
  await page.goto('/');
  await page.locator('#systems-thinking').click();
  expect(page.url()).toBe('http://localhost:4200/systems-thinking');
});

test('check that prototype warning dialog opens', async ({ page }) => {
  await page.goto('/');
  await page.locator('#prototype-dialog-launch').click();
  await expect(page.locator('.cdk-overlay-pane.prototype-warning')).toBeVisible();
});
