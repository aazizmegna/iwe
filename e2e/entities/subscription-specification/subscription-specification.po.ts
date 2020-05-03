import { element, by, browser, ElementFinder } from 'protractor';

export class SubscriptionSpecificationComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Subscription Specifications found.'));
  entities = element.all(by.css('page-subscription-specification ion-item'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastViewButton(): Promise<void> {
    await this.viewButtons.last().click();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  async getEntitiesNumber(): Promise<number> {
    return await this.entities.count();
  }
}

export class SubscriptionSpecificationUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  numberOfUsersInput = element(by.css('ion-input[formControlName="numberOfUsers"] input'));
  targetAreaInput = element(by.css('ion-input[formControlName="targetArea"] input'));
  profilePageSelect = element(by.css('ion-select[formControlName="profilePage"]'));
  paymentOptionSelect = element(by.css('ion-select[formControlName="paymentOption"]'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setNumberOfUsersInput(numberOfUsers: string): Promise<void> {
    await this.numberOfUsersInput.sendKeys(numberOfUsers);
  }
  async setTargetAreaInput(targetArea: string): Promise<void> {
    await this.targetAreaInput.sendKeys(targetArea);
  }
  async profilePageSelectLastOption(): Promise<void> {
    await this.profilePageSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async paymentOptionSelectLastOption(): Promise<void> {
    await this.paymentOptionSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class SubscriptionSpecificationDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  numberOfUsersInput = element.all(by.css('span')).get(1);

  targetAreaInput = element.all(by.css('span')).get(2);

  async getNumberOfUsersInput(): Promise<string> {
    return await this.numberOfUsersInput.getText();
  }

  async getTargetAreaInput(): Promise<string> {
    return await this.targetAreaInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
