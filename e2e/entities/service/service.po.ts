import { element, by, browser, ElementFinder } from 'protractor';

export class ServiceComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Services found.'));
  entities = element.all(by.css('page-service ion-item'));

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

export class ServiceUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  pictureInput = element(by.css('ion-input[formControlName="picture"] input'));
  locationInput = element(by.css('ion-input[formControlName="location"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async setPictureInput(picture: string): Promise<void> {
    await this.pictureInput.sendKeys(picture);
  }
  async setLocationInput(location: string): Promise<void> {
    await this.locationInput.sendKeys(location);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ServiceDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  nameInput = element.all(by.css('span')).get(1);

  pictureInput = element.all(by.css('span')).get(2);

  locationInput = element.all(by.css('span')).get(3);

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getPictureInput(): Promise<string> {
    return await this.pictureInput.getText();
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
