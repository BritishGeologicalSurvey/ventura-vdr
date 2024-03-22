import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Layers {
  constructor(public readonly page: Page) {}

  public async goto() {
    await this.page.goto('/vdr');
  }

  public async loadRiversLayer() {
    await this.page.getByRole('option', { name: 'Rivers' }).click();
    const response = await this.page.waitForResponse((pageResponse) => pageResponse.url().includes('/OS_OpenRivers/'));
    expect(response.status()).toBe(200);
  }

  public async loadLPALayer() {
    await this.page.getByRole('option', { name: 'LPAs' }).click();
    const response = await this.page.waitForResponse((pageResponse) =>
      pageResponse.url().includes('/Local_Planning_Authorities_April_2022_UK_BUC_2022/'),
    );
    expect(response.status()).toBe(200);
  }

  public async loadWWTPLayer() {
    await this.page.getByRole('option', { name: 'WWTP' }).click();
    const response = await this.page.waitForResponse((pageResponse) => pageResponse.url().includes('/ventura_wwtp/'));
    expect(response.status()).toBe(200);
  }
}
