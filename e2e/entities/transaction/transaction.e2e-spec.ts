import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { TransactionComponentsPage, TransactionDetailPage, TransactionUpdatePage } from './transaction.po';

describe('Transaction e2e test', () => {
  let loginPage: LoginPage;
  let transactionComponentsPage: TransactionComponentsPage;
  let transactionUpdatePage: TransactionUpdatePage;
  let transactionDetailPage: TransactionDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Transactions';
  const SUBCOMPONENT_TITLE = 'Transaction';
  let lastElement: any;
  let isVisible = false;

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

  it('should load Transactions', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Transaction')
      .first()
      .click();

    transactionComponentsPage = new TransactionComponentsPage();
    await browser.wait(ec.visibilityOf(transactionComponentsPage.title), 5000);
    expect(await transactionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(transactionComponentsPage.entities.get(0)), ec.visibilityOf(transactionComponentsPage.noResult)),
      5000
    );
  });

  it('should create Transaction', async () => {
    initNumberOfEntities = await transactionComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(transactionComponentsPage.createButton), 5000);
    await transactionComponentsPage.clickOnCreateButton();
    transactionUpdatePage = new TransactionUpdatePage();
    await browser.wait(ec.visibilityOf(transactionUpdatePage.pageTitle), 1000);
    expect(await transactionUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await transactionUpdatePage.paymentTypeSelectLastOption();

    await transactionUpdatePage.save();
    await browser.wait(ec.visibilityOf(transactionComponentsPage.title), 1000);
    expect(await transactionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await transactionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Transaction', async () => {
    transactionComponentsPage = new TransactionComponentsPage();
    await browser.wait(ec.visibilityOf(transactionComponentsPage.title), 5000);
    lastElement = await transactionComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Transaction', async () => {
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

  it('should view the last Transaction', async () => {
    transactionDetailPage = new TransactionDetailPage();
    if (isVisible && (await transactionDetailPage.pageTitle.isDisplayed())) {
      expect(await transactionDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);
    }
  });

  it('should delete last Transaction', async () => {
    transactionDetailPage = new TransactionDetailPage();
    if (isVisible && (await transactionDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await transactionDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(transactionComponentsPage.title), 3000);
      expect(await transactionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await transactionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Transactions tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
