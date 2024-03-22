import type { Page } from '@playwright/test';

export class Baseline {
  constructor(public readonly page: Page) {}

  public async goto() {
    await this.page.goto('/vdr');
  }

  public async waitForCanvas() {
    this.page.waitForSelector('canvas');
  }

  public async checkWaterFlowValue() {
    await this.page.getByRole('button', { name: '140900' }).click();
  }

  public async checkExcessWaterValue() {
    await this.page
      .locator(
        'mat-list-option:nth-child(2) > .mdc-list-item__start > .mdc-radio > .mdc-radio__background > .mdc-radio__outer-circle',
      )
      .click();
    await this.page.getByRole('button', { name: '36330' }).click();
  }

  public async checkWaterQualityValue() {
    await this.page
      .locator(
        'mat-list-option:nth-child(3) > .mdc-list-item__start > .mdc-radio > .mdc-radio__background > .mdc-radio__outer-circle',
      )
      .click();
    await this.page.getByRole('button', { name: '857.81' }).click();
  }

  public async openTableView() {
    await this.page.getByText('Table View').click();
  }
}
