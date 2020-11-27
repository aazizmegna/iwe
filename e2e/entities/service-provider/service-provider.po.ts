import { element, by, browser, ElementFinder } from 'protractor';

export class ServiceProviderComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Service Providers found.'));
  entities = element.all(by.css('page-service-provider ion-item'));

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

export class ServiceProviderUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  taxRegistrationInput = element(by.css('ion-input[formControlName="taxRegistration"] input'));
  licenseOfTradeInput = element(by.css('ion-input[formControlName="licenseOfTrade"] input'));
  criminalRecordInput = element(by.css('ion-input[formControlName="criminalRecord"] input'));
  locationInput = element(by.css('ion-input[formControlName="location"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setTaxRegistrationInput(taxRegistration: string): Promise<void> {
    await this.taxRegistrationInput.sendKeys(taxRegistration);
  }
  async setLicenseOfTradeInput(licenseOfTrade: string): Promise<void> {
    await this.licenseOfTradeInput.sendKeys(licenseOfTrade);
  }
  async setCriminalRecordInput(criminalRecord: string): Promise<void> {
    await this.criminalRecordInput.sendKeys(criminalRecord);
  }
  async setLocationInput(location: string): Promise<void> {
    await this.locationInput.sendKeys(location);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ServiceProviderDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  taxRegistrationInput = element.all(by.css('span')).get(1);

  licenseOfTradeInput = element.all(by.css('span')).get(2);

  criminalRecordInput = element.all(by.css('span')).get(3);

  locationInput = element.all(by.css('span')).get(4);

  async getTaxRegistrationInput(): Promise<string> {
    return await this.taxRegistrationInput.getText();
  }

  async getLicenseOfTradeInput(): Promise<string> {
    return await this.licenseOfTradeInput.getText();
  }

  async getCriminalRecordInput(): Promise<string> {
    return await this.criminalRecordInput.getText();
  }

  async getLocationInput(): Promise<string> {
    return await this.locationInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
