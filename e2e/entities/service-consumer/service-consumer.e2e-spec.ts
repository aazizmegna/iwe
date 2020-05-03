import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ServiceConsumerComponentsPage, ServiceConsumerDetailPage, ServiceConsumerUpdatePage } from './service-consumer.po';

describe('ServiceConsumer e2e test', () => {
  let loginPage: LoginPage;
  let serviceConsumerComponentsPage: ServiceConsumerComponentsPage;
  let serviceConsumerUpdatePage: ServiceConsumerUpdatePage;
  let serviceConsumerDetailPage: ServiceConsumerDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Service Consumers';
  const SUBCOMPONENT_TITLE = 'Service Consumer';
  let lastElement: any;
  let isVisible = false;

  const location = 'location';

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

  it('should load ServiceConsumers', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ServiceConsumer')
      .first()
      .click();

    serviceConsumerComponentsPage = new ServiceConsumerComponentsPage();
    await browser.wait(ec.visibilityOf(serviceConsumerComponentsPage.title), 5000);
    expect(await serviceConsumerComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(serviceConsumerComponentsPage.entities.get(0)), ec.visibilityOf(serviceConsumerComponentsPage.noResult)),
      5000
    );
  });

  it('should create ServiceConsumer', async () => {
    initNumberOfEntities = await serviceConsumerComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(serviceConsumerComponentsPage.createButton), 5000);
    await serviceConsumerComponentsPage.clickOnCreateButton();
    serviceConsumerUpdatePage = new ServiceConsumerUpdatePage();
    await browser.wait(ec.visibilityOf(serviceConsumerUpdatePage.pageTitle), 1000);
    expect(await serviceConsumerUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await serviceConsumerUpdatePage.setLocationInput(location);

    await serviceConsumerUpdatePage.save();
    await browser.wait(ec.visibilityOf(serviceConsumerComponentsPage.title), 1000);
    expect(await serviceConsumerComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await serviceConsumerComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ServiceConsumer', async () => {
    serviceConsumerComponentsPage = new ServiceConsumerComponentsPage();
    await browser.wait(ec.visibilityOf(serviceConsumerComponentsPage.title), 5000);
    lastElement = await serviceConsumerComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ServiceConsumer', async () => {
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

  it('should view the last ServiceConsumer', async () => {
    serviceConsumerDetailPage = new ServiceConsumerDetailPage();
    if (isVisible && (await serviceConsumerDetailPage.pageTitle.isDisplayed())) {
      expect(await serviceConsumerDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await serviceConsumerDetailPage.getLocationInput()).toEqual(location);
    }
  });

  it('should delete last ServiceConsumer', async () => {
    serviceConsumerDetailPage = new ServiceConsumerDetailPage();
    if (isVisible && (await serviceConsumerDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await serviceConsumerDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(serviceConsumerComponentsPage.title), 3000);
      expect(await serviceConsumerComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await serviceConsumerComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ServiceConsumers tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
