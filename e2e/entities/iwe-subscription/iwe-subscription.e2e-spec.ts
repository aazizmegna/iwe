import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { IWESubscriptionComponentsPage, IWESubscriptionDetailPage, IWESubscriptionUpdatePage } from './iwe-subscription.po';

describe('IWESubscription e2e test', () => {
  let loginPage: LoginPage;
  let iWESubscriptionComponentsPage: IWESubscriptionComponentsPage;
  let iWESubscriptionUpdatePage: IWESubscriptionUpdatePage;
  let iWESubscriptionDetailPage: IWESubscriptionDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'IWE Subscriptions';
  const SUBCOMPONENT_TITLE = 'IWE Subscription';
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

  it('should load IWESubscriptions', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'IWESubscription')
      .first()
      .click();

    iWESubscriptionComponentsPage = new IWESubscriptionComponentsPage();
    await browser.wait(ec.visibilityOf(iWESubscriptionComponentsPage.title), 5000);
    expect(await iWESubscriptionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(iWESubscriptionComponentsPage.entities.get(0)), ec.visibilityOf(iWESubscriptionComponentsPage.noResult)),
      5000
    );
  });

  it('should create IWESubscription', async () => {
    initNumberOfEntities = await iWESubscriptionComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(iWESubscriptionComponentsPage.createButton), 5000);
    await iWESubscriptionComponentsPage.clickOnCreateButton();
    iWESubscriptionUpdatePage = new IWESubscriptionUpdatePage();
    await browser.wait(ec.visibilityOf(iWESubscriptionUpdatePage.pageTitle), 1000);
    expect(await iWESubscriptionUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await iWESubscriptionUpdatePage.typeSelectLastOption();

    await iWESubscriptionUpdatePage.save();
    await browser.wait(ec.visibilityOf(iWESubscriptionComponentsPage.title), 1000);
    expect(await iWESubscriptionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await iWESubscriptionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last IWESubscription', async () => {
    iWESubscriptionComponentsPage = new IWESubscriptionComponentsPage();
    await browser.wait(ec.visibilityOf(iWESubscriptionComponentsPage.title), 5000);
    lastElement = await iWESubscriptionComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last IWESubscription', async () => {
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

  it('should view the last IWESubscription', async () => {
    iWESubscriptionDetailPage = new IWESubscriptionDetailPage();
    if (isVisible && (await iWESubscriptionDetailPage.pageTitle.isDisplayed())) {
      expect(await iWESubscriptionDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);
    }
  });

  it('should delete last IWESubscription', async () => {
    iWESubscriptionDetailPage = new IWESubscriptionDetailPage();
    if (isVisible && (await iWESubscriptionDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await iWESubscriptionDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(iWESubscriptionComponentsPage.title), 3000);
      expect(await iWESubscriptionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await iWESubscriptionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish IWESubscriptions tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
