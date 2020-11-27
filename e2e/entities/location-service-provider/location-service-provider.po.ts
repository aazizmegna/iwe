import { element, by, browser, ElementFinder } from 'protractor';

export class LocationServiceProviderComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Location Service Providers found.'));
  entities = element.all(by.css('page-location-service-provider ion-item'));

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

export class LocationServiceProviderUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  trafficRegistrationInput = element(by.css('ion-input[formControlName="trafficRegistration"] input'));
  criminalRecordInput = element(by.css('ion-input[formControlName="criminalRecord"] input'));
  taxRegistrationInput = element(by.css('ion-input[formControlName="taxRegistration"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setTrafficRegistrationInput(trafficRegistration: string): Promise<void> {
    await this.trafficRegistrationInput.sendKeys(trafficRegistration);
  }
  async setCriminalRecordInput(criminalRecord: string): Promise<void> {
    await this.criminalRecordInput.sendKeys(criminalRecord);
  }
  async setTaxRegistrationInput(taxRegistration: string): Promise<void> {
    await this.taxRegistrationInput.sendKeys(taxRegistration);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class LocationServiceProviderDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  trafficRegistrationInput = element.all(by.css('span')).get(1);

  criminalRecordInput = element.all(by.css('span')).get(2);

  taxRegistrationInput = element.all(by.css('span')).get(3);

  async getTrafficRegistrationInput(): Promise<string> {
    return await this.trafficRegistrationInput.getText();
  }

  async getCriminalRecordInput(): Promise<string> {
    return await this.criminalRecordInput.getText();
  }

  async getTaxRegistrationInput(): Promise<string> {
    return await this.taxRegistrationInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
