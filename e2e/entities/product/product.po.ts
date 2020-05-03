import { element, by, browser, ElementFinder } from 'protractor';

export class ProductComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Products found.'));
  entities = element.all(by.css('page-product ion-item'));

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

export class ProductUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  sellingPriceInput = element(by.css('ion-input[formControlName="sellingPrice"] input'));
  purchasePriceInput = element(by.css('ion-input[formControlName="purchasePrice"] input'));
  qTYOnHandInput = element(by.css('ion-input[formControlName="qTYOnHand"] input'));
  pictureUrlInput = element(by.css('ion-input[formControlName="pictureUrl"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async setSellingPriceInput(sellingPrice: string): Promise<void> {
    await this.sellingPriceInput.sendKeys(sellingPrice);
  }
  async setPurchasePriceInput(purchasePrice: string): Promise<void> {
    await this.purchasePriceInput.sendKeys(purchasePrice);
  }
  async setQTYOnHandInput(qTYOnHand: string): Promise<void> {
    await this.qTYOnHandInput.sendKeys(qTYOnHand);
  }
  async setPictureUrlInput(pictureUrl: string): Promise<void> {
    await this.pictureUrlInput.sendKeys(pictureUrl);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ProductDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  nameInput = element.all(by.css('span')).get(1);

  sellingPriceInput = element.all(by.css('span')).get(2);

  purchasePriceInput = element.all(by.css('span')).get(3);

  qTYOnHandInput = element.all(by.css('span')).get(4);

  pictureUrlInput = element.all(by.css('span')).get(5);

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getSellingPriceInput(): Promise<string> {
    return await this.sellingPriceInput.getText();
  }

  async getPurchasePriceInput(): Promise<string> {
    return await this.purchasePriceInput.getText();
  }

  async getQTYOnHandInput(): Promise<string> {
    return await this.qTYOnHandInput.getText();
  }

  async getPictureUrlInput(): Promise<string> {
    return await this.pictureUrlInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
