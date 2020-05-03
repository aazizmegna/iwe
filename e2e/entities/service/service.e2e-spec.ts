import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ServiceComponentsPage, ServiceDetailPage, ServiceUpdatePage } from './service.po';

describe('Service e2e test', () => {
  let loginPage: LoginPage;
  let serviceComponentsPage: ServiceComponentsPage;
  let serviceUpdatePage: ServiceUpdatePage;
  let serviceDetailPage: ServiceDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Services';
  const SUBCOMPONENT_TITLE = 'Service';
  let lastElement: any;
  let isVisible = false;

  const name = 'name';
  const pictureURL = 'pictureURL';
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

  it('should load Services', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Service')
      .first()
      .click();

    serviceComponentsPage = new ServiceComponentsPage();
    await browser.wait(ec.visibilityOf(serviceComponentsPage.title), 5000);
    expect(await serviceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(serviceComponentsPage.entities.get(0)), ec.visibilityOf(serviceComponentsPage.noResult)),
      5000
    );
  });

  it('should create Service', async () => {
    initNumberOfEntities = await serviceComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(serviceComponentsPage.createButton), 5000);
    await serviceComponentsPage.clickOnCreateButton();
    serviceUpdatePage = new ServiceUpdatePage();
    await browser.wait(ec.visibilityOf(serviceUpdatePage.pageTitle), 1000);
    expect(await serviceUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await serviceUpdatePage.setNameInput(name);
    await serviceUpdatePage.setPictureURLInput(pictureURL);
    await serviceUpdatePage.setLocationInput(location);

    await serviceUpdatePage.save();
    await browser.wait(ec.visibilityOf(serviceComponentsPage.title), 1000);
    expect(await serviceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await serviceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Service', async () => {
    serviceComponentsPage = new ServiceComponentsPage();
    await browser.wait(ec.visibilityOf(serviceComponentsPage.title), 5000);
    lastElement = await serviceComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Service', async () => {
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

  it('should view the last Service', async () => {
    serviceDetailPage = new ServiceDetailPage();
    if (isVisible && (await serviceDetailPage.pageTitle.isDisplayed())) {
      expect(await serviceDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await serviceDetailPage.getNameInput()).toEqual(name);

      expect(await serviceDetailPage.getPictureURLInput()).toEqual(pictureURL);

      expect(await serviceDetailPage.getLocationInput()).toEqual(location);
    }
  });

  it('should delete last Service', async () => {
    serviceDetailPage = new ServiceDetailPage();
    if (isVisible && (await serviceDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await serviceDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(serviceComponentsPage.title), 3000);
      expect(await serviceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await serviceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Services tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
