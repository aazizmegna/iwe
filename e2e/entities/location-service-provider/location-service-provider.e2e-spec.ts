import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  LocationServiceProviderComponentsPage,
  LocationServiceProviderDetailPage,
  LocationServiceProviderUpdatePage,
} from './location-service-provider.po';

describe('LocationServiceProvider e2e test', () => {
  let loginPage: LoginPage;
  let locationServiceProviderComponentsPage: LocationServiceProviderComponentsPage;
  let locationServiceProviderUpdatePage: LocationServiceProviderUpdatePage;
  let locationServiceProviderDetailPage: LocationServiceProviderDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Location Service Providers';
  const SUBCOMPONENT_TITLE = 'Location Service Provider';
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

  it('should load LocationServiceProviders', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'LocationServiceProvider')
      .first()
      .click();

    locationServiceProviderComponentsPage = new LocationServiceProviderComponentsPage();
    await browser.wait(ec.visibilityOf(locationServiceProviderComponentsPage.title), 5000);
    expect(await locationServiceProviderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(locationServiceProviderComponentsPage.entities.get(0)),
        ec.visibilityOf(locationServiceProviderComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create LocationServiceProvider', async () => {
    initNumberOfEntities = await locationServiceProviderComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(locationServiceProviderComponentsPage.createButton), 5000);
    await locationServiceProviderComponentsPage.clickOnCreateButton();
    locationServiceProviderUpdatePage = new LocationServiceProviderUpdatePage();
    await browser.wait(ec.visibilityOf(locationServiceProviderUpdatePage.pageTitle), 1000);
    expect(await locationServiceProviderUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await locationServiceProviderUpdatePage.setTrafficRegistrationInput(trafficRegistration);
    await locationServiceProviderUpdatePage.setCriminalRecordInput(criminalRecord);
    await locationServiceProviderUpdatePage.setTaxRegistrationInput(taxRegistration);

    await locationServiceProviderUpdatePage.save();
    await browser.wait(ec.visibilityOf(locationServiceProviderComponentsPage.title), 1000);
    expect(await locationServiceProviderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await locationServiceProviderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last LocationServiceProvider', async () => {
    locationServiceProviderComponentsPage = new LocationServiceProviderComponentsPage();
    await browser.wait(ec.visibilityOf(locationServiceProviderComponentsPage.title), 5000);
    lastElement = await locationServiceProviderComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last LocationServiceProvider', async () => {
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

  it('should view the last LocationServiceProvider', async () => {
    locationServiceProviderDetailPage = new LocationServiceProviderDetailPage();
    if (isVisible && (await locationServiceProviderDetailPage.pageTitle.isDisplayed())) {
      expect(await locationServiceProviderDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await locationServiceProviderDetailPage.getTrafficRegistrationInput()).toEqual(trafficRegistration);

      expect(await locationServiceProviderDetailPage.getCriminalRecordInput()).toEqual(criminalRecord);

      expect(await locationServiceProviderDetailPage.getTaxRegistrationInput()).toEqual(taxRegistration);
    }
  });

  it('should delete last LocationServiceProvider', async () => {
    locationServiceProviderDetailPage = new LocationServiceProviderDetailPage();
    if (isVisible && (await locationServiceProviderDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await locationServiceProviderDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(locationServiceProviderComponentsPage.title), 3000);
      expect(await locationServiceProviderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await locationServiceProviderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish LocationServiceProviders tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
