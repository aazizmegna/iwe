import { element, by, browser, ElementFinder } from 'protractor';

export class PicturePostComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Picture Posts found.'));
  entities = element.all(by.css('page-picture-post ion-item'));

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

export class PicturePostUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  contentInput = element(by.css('ion-input[formControlName="content"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setContentInput(content: string): Promise<void> {
    await this.contentInput.sendKeys(content);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class PicturePostDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  contentInput = element.all(by.css('span')).get(1);

  async getContentInput(): Promise<string> {
    return await this.contentInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
