import { element, by, browser, ElementFinder } from 'protractor';

export class TransactionComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Transactions found.'));
  entities = element.all(by.css('page-transaction ion-item'));

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

export class TransactionUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  paymentTypeSelect = element(by.css('ion-select[formControlName="paymentType"]'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async paymentTypeSelectLastOption(): Promise<void> {
    await this.paymentTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class TransactionDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
