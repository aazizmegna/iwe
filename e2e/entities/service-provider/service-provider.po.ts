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

  taxRegistrationUrlInput = element(by.css('ion-input[formControlName="taxRegistrationUrl"] input'));
  licenseOfTradeUrlInput = element(by.css('ion-input[formControlName="licenseOfTradeUrl"] input'));
  criminalRecordUrlInput = element(by.css('ion-input[formControlName="criminalRecordUrl"] input'));
  locationInput = element(by.css('ion-input[formControlName="location"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setTaxRegistrationUrlInput(taxRegistrationUrl: string): Promise<void> {
    await this.taxRegistrationUrlInput.sendKeys(taxRegistrationUrl);
  }
  async setLicenseOfTradeUrlInput(licenseOfTradeUrl: string): Promise<void> {
    await this.licenseOfTradeUrlInput.sendKeys(licenseOfTradeUrl);
  }
  async setCriminalRecordUrlInput(criminalRecordUrl: string): Promise<void> {
    await this.criminalRecordUrlInput.sendKeys(criminalRecordUrl);
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
  taxRegistrationUrlInput = element.all(by.css('span')).get(1);

  licenseOfTradeUrlInput = element.all(by.css('span')).get(2);

  criminalRecordUrlInput = element.all(by.css('span')).get(3);

  locationInput = element.all(by.css('span')).get(4);

  async getTaxRegistrationUrlInput(): Promise<string> {
    return await this.taxRegistrationUrlInput.getText();
  }

  async getLicenseOfTradeUrlInput(): Promise<string> {
    return await this.licenseOfTradeUrlInput.getText();
  }

  async getCriminalRecordUrlInput(): Promise<string> {
    return await this.criminalRecordUrlInput.getText();
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
