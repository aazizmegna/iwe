import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ProductComponentsPage, ProductDetailPage, ProductUpdatePage } from './product.po';

describe('Product e2e test', () => {
  let loginPage: LoginPage;
  let productComponentsPage: ProductComponentsPage;
  let productUpdatePage: ProductUpdatePage;
  let productDetailPage: ProductDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Products';
  const SUBCOMPONENT_TITLE = 'Product';
  let lastElement: any;
  let isVisible = false;

  const name = 'name';
  const sellingPrice = '10';
  const purchasePrice = '10';
  const qTYOnHand = '10';
  const pictureUrl = 'pictureUrl';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await browser.wait(ec.elementToBeClickable(loginPage.loginButton), 3000);
    await loginPage.login(username, password);
    await browser.wait(ec.visibilityOf(loginPage.logoutButton), 1000);
  });

  it('should load Products', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Product')
      .first()
      .click();

    productComponentsPage = new ProductComponentsPage();
    await browser.wait(ec.visibilityOf(productComponentsPage.title), 5000);
    expect(await productComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(productComponentsPage.entities.get(0)), ec.visibilityOf(productComponentsPage.noResult)),
      5000
    );
  });

  it('should create Product', async () => {
    initNumberOfEntities = await productComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(productComponentsPage.createButton), 5000);
    await productComponentsPage.clickOnCreateButton();
    productUpdatePage = new ProductUpdatePage();
    await browser.wait(ec.visibilityOf(productUpdatePage.pageTitle), 1000);
    expect(await productUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await productUpdatePage.setNameInput(name);
    await productUpdatePage.setSellingPriceInput(sellingPrice);
    await productUpdatePage.setPurchasePriceInput(purchasePrice);
    await productUpdatePage.setQTYOnHandInput(qTYOnHand);
    await productUpdatePage.setPictureUrlInput(pictureUrl);

    await productUpdatePage.save();
    await browser.wait(ec.visibilityOf(productComponentsPage.title), 1000);
    expect(await productComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await productComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Product', async () => {
    productComponentsPage = new ProductComponentsPage();
    await browser.wait(ec.visibilityOf(productComponentsPage.title), 5000);
    lastElement = await productComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Product', async () => {
    browser
      .executeScript('arguments[0].scrollIntoView()', lastElement)
      .then(async () => {
        if ((await lastElement.isEnabled()) && (await lastElement.isDisplayed())) {
          browser
            .executeScript('arguments[0].click()', lastElement)
            .then(async () => {
              isVisible = true;
            })
            .catch();
        }
      })
      .catch();
  });

  it('should view the last Product', async () => {
    productDetailPage = new ProductDetailPage();
    if (isVisible && (await productDetailPage.pageTitle.isDisplayed())) {
      expect(await productDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await productDetailPage.getNameInput()).toEqual(name);

      expect(await productDetailPage.getSellingPriceInput()).toEqual(sellingPrice);

      expect(await productDetailPage.getPurchasePriceInput()).toEqual(purchasePrice);

      expect(await productDetailPage.getQTYOnHandInput()).toEqual(qTYOnHand);

      expect(await productDetailPage.getPictureUrlInput()).toEqual(pictureUrl);
    }
  });

  it('should delete last Product', async () => {
    productDetailPage = new ProductDetailPage();
    if (isVisible && (await productDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await productDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(productComponentsPage.title), 3000);
      expect(await productComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await productComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Products tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
