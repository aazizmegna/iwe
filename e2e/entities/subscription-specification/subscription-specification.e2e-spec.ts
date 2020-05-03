import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  SubscriptionSpecificationComponentsPage,
  SubscriptionSpecificationDetailPage,
  SubscriptionSpecificationUpdatePage,
} from './subscription-specification.po';

describe('SubscriptionSpecification e2e test', () => {
  let loginPage: LoginPage;
  let subscriptionSpecificationComponentsPage: SubscriptionSpecificationComponentsPage;
  let subscriptionSpecificationUpdatePage: SubscriptionSpecificationUpdatePage;
  let subscriptionSpecificationDetailPage: SubscriptionSpecificationDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Subscription Specifications';
  const SUBCOMPONENT_TITLE = 'Subscription Specification';
  let lastElement: any;
  let isVisible = false;

  const numberOfUsers = '10';
  const targetArea = '10';

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

  it('should load SubscriptionSpecifications', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'SubscriptionSpecification')
      .first()
      .click();

    subscriptionSpecificationComponentsPage = new SubscriptionSpecificationComponentsPage();
    await browser.wait(ec.visibilityOf(subscriptionSpecificationComponentsPage.title), 5000);
    expect(await subscriptionSpecificationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(subscriptionSpecificationComponentsPage.entities.get(0)),
        ec.visibilityOf(subscriptionSpecificationComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create SubscriptionSpecification', async () => {
    initNumberOfEntities = await subscriptionSpecificationComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(subscriptionSpecificationComponentsPage.createButton), 5000);
    await subscriptionSpecificationComponentsPage.clickOnCreateButton();
    subscriptionSpecificationUpdatePage = new SubscriptionSpecificationUpdatePage();
    await browser.wait(ec.visibilityOf(subscriptionSpecificationUpdatePage.pageTitle), 1000);
    expect(await subscriptionSpecificationUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await subscriptionSpecificationUpdatePage.setNumberOfUsersInput(numberOfUsers);
    await subscriptionSpecificationUpdatePage.setTargetAreaInput(targetArea);
    await subscriptionSpecificationUpdatePage.profilePageSelectLastOption();
    await subscriptionSpecificationUpdatePage.paymentOptionSelectLastOption();

    await subscriptionSpecificationUpdatePage.save();
    await browser.wait(ec.visibilityOf(subscriptionSpecificationComponentsPage.title), 1000);
    expect(await subscriptionSpecificationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await subscriptionSpecificationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last SubscriptionSpecification', async () => {
    subscriptionSpecificationComponentsPage = new SubscriptionSpecificationComponentsPage();
    await browser.wait(ec.visibilityOf(subscriptionSpecificationComponentsPage.title), 5000);
    lastElement = await subscriptionSpecificationComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last SubscriptionSpecification', async () => {
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

  it('should view the last SubscriptionSpecification', async () => {
    subscriptionSpecificationDetailPage = new SubscriptionSpecificationDetailPage();
    if (isVisible && (await subscriptionSpecificationDetailPage.pageTitle.isDisplayed())) {
      expect(await subscriptionSpecificationDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await subscriptionSpecificationDetailPage.getNumberOfUsersInput()).toEqual(numberOfUsers);

      expect(await subscriptionSpecificationDetailPage.getTargetAreaInput()).toEqual(targetArea);
    }
  });

  it('should delete last SubscriptionSpecification', async () => {
    subscriptionSpecificationDetailPage = new SubscriptionSpecificationDetailPage();
    if (isVisible && (await subscriptionSpecificationDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await subscriptionSpecificationDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(subscriptionSpecificationComponentsPage.title), 3000);
      expect(await subscriptionSpecificationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await subscriptionSpecificationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish SubscriptionSpecifications tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
