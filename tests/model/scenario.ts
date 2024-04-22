import type { Page } from '@playwright/test';

export class Scenario {
  constructor(public readonly page: Page) {}

  public async goto() {
    await this.page.goto('/vdr');
  }

  public async openDialog() {
    await this.page.getByRole('button', { name: 'Create intervention scenario' }).click();
    await this.page.getByLabel('Scenario name').click();
    await this.page.getByLabel('Scenario name').fill('Test');
    await this.page.getByLabel('Scenario name').press('Tab');
    await this.page.getByLabel('Description').fill('Description');
    await this.page.getByRole('button', { name: 'Create' }).click();
  }

  public async selectCatchments() {
    await this.page.waitForSelector('canvas');
    await this.page.locator('canvas').click({
      position: {
        x: 561,
        y: 337,
      },
    });
    await this.page.locator('canvas').click({
      position: {
        x: 585,
        y: 478,
      },
    });
    await this.page.locator('canvas').click({
      position: {
        x: 685,
        y: 456,
      },
    });
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  public async editCatchments() {
    await this.page.locator('#rcForNewDevelopment').click();
    await this.page.locator('#rcForNewDevelopment').fill('0.3');
    await this.page.locator('#waterDemandForNewDevelopment').click();
    await this.page.locator('#waterDemandForNewDevelopment').fill('120');
    await this.page.locator('#overallAreaForNewDevelopment').click();
    await this.page.locator('#overallAreaForNewDevelopment').fill('98');
    await this.page.locator('#retrofitPropertiesAppliedTo').click();
    await this.page.locator('#retrofitPropertiesAppliedTo').fill('0.2');
    await this.page.locator('#retrofitWaterDemand').click();
    await this.page.locator('#retrofitWaterDemand').fill('85');
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  public async viewResults() {
    await this.page.getByRole('button', { name: 'View Results' }).click();
    await this.page.waitForSelector('#view-results');
    await this.page.getByRole('button', { name: 'View Results' }).click();
  }
}
