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

  trafficRegistrationUrlInput = element(by.css('ion-input[formControlName="trafficRegistrationUrl"] input'));
  criminalRecordUrlInput = element(by.css('ion-input[formControlName="criminalRecordUrl"] input'));
  taxRegistrationUrlInput = element(by.css('ion-input[formControlName="taxRegistrationUrl"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setTrafficRegistrationUrlInput(trafficRegistrationUrl: string): Promise<void> {
    await this.trafficRegistrationUrlInput.sendKeys(trafficRegistrationUrl);
  }
  async setCriminalRecordUrlInput(criminalRecordUrl: string): Promise<void> {
    await this.criminalRecordUrlInput.sendKeys(criminalRecordUrl);
  }
  async setTaxRegistrationUrlInput(taxRegistrationUrl: string): Promise<void> {
    await this.taxRegistrationUrlInput.sendKeys(taxRegistrationUrl);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class LocationServiceProviderDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  trafficRegistrationUrlInput = element.all(by.css('span')).get(1);

  criminalRecordUrlInput = element.all(by.css('span')).get(2);

  taxRegistrationUrlInput = element.all(by.css('span')).get(3);

  async getTrafficRegistrationUrlInput(): Promise<string> {
    return await this.trafficRegistrationUrlInput.getText();
  }

  async getCriminalRecordUrlInput(): Promise<string> {
    return await this.criminalRecordUrlInput.getText();
  }

  async getTaxRegistrationUrlInput(): Promise<string> {
    return await this.taxRegistrationUrlInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
