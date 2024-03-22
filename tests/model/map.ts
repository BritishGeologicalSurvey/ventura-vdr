import type { Page } from '@playwright/test';

export class Map {
  constructor(public readonly page: Page) {}

  public async goto() {
    await this.page.goto('/vdr');
  }

  public async waitForIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  public async testPopulationLayer() {
    await this.page.getByRole('button', { name: 'Reference layers' }).click();
    await this.page.getByRole('option', { name: 'Population' }).click();
    await this.page.waitForTimeout(1000);
  }

  public async testGreenSpaceLayer() {
    await this.page.getByRole('button', { name: 'Reference layers' }).click();
    await this.page.getByRole('option', { name: 'Green Space' }).click();
    await this.page.waitForTimeout(1000);
  }

  public async testImperviousAreaLayer() {
    await this.page.getByRole('button', { name: 'Reference layers' }).click();
    await this.page.getByRole('option', { name: 'Impervious Area' }).click();
    await this.page.waitForTimeout(1000);
  }
}
