import { element, by, browser, ElementFinder } from 'protractor';

export class RatingComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Ratings found.'));
  entities = element.all(by.css('page-rating ion-item'));

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

export class RatingUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  ratingInput = element(by.css('ion-input[formControlName="rating"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setRatingInput(rating: string): Promise<void> {
    await this.ratingInput.sendKeys(rating);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class RatingDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  ratingInput = element.all(by.css('span')).get(1);

  async getRatingInput(): Promise<string> {
    return await this.ratingInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
