import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ServiceProviderComponentsPage, ServiceProviderDetailPage, ServiceProviderUpdatePage } from './service-provider.po';

describe('ServiceProvider e2e test', () => {
  let loginPage: LoginPage;
  let serviceProviderComponentsPage: ServiceProviderComponentsPage;
  let serviceProviderUpdatePage: ServiceProviderUpdatePage;
  let serviceProviderDetailPage: ServiceProviderDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Service Providers';
  const SUBCOMPONENT_TITLE = 'Service Provider';
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

  it('should load ServiceProviders', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ServiceProvider')
      .first()
      .click();

    serviceProviderComponentsPage = new ServiceProviderComponentsPage();
    await browser.wait(ec.visibilityOf(serviceProviderComponentsPage.title), 5000);
    expect(await serviceProviderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(serviceProviderComponentsPage.entities.get(0)), ec.visibilityOf(serviceProviderComponentsPage.noResult)),
      5000
    );
  });

  it('should create ServiceProvider', async () => {
    initNumberOfEntities = await serviceProviderComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(serviceProviderComponentsPage.createButton), 5000);
    await serviceProviderComponentsPage.clickOnCreateButton();
    serviceProviderUpdatePage = new ServiceProviderUpdatePage();
    await browser.wait(ec.visibilityOf(serviceProviderUpdatePage.pageTitle), 1000);
    expect(await serviceProviderUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await serviceProviderUpdatePage.setTaxRegistrationInput(taxRegistration);
    await serviceProviderUpdatePage.setLicenseOfTradeInput(licenseOfTrade);
    await serviceProviderUpdatePage.setCriminalRecordInput(criminalRecord);
    await serviceProviderUpdatePage.setLocationInput(location);

    await serviceProviderUpdatePage.save();
    await browser.wait(ec.visibilityOf(serviceProviderComponentsPage.title), 1000);
    expect(await serviceProviderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await serviceProviderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ServiceProvider', async () => {
    serviceProviderComponentsPage = new ServiceProviderComponentsPage();
    await browser.wait(ec.visibilityOf(serviceProviderComponentsPage.title), 5000);
    lastElement = await serviceProviderComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ServiceProvider', async () => {
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

  it('should view the last ServiceProvider', async () => {
    serviceProviderDetailPage = new ServiceProviderDetailPage();
    if (isVisible && (await serviceProviderDetailPage.pageTitle.isDisplayed())) {
      expect(await serviceProviderDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await serviceProviderDetailPage.getTaxRegistrationInput()).toEqual(taxRegistration);

      expect(await serviceProviderDetailPage.getLicenseOfTradeInput()).toEqual(licenseOfTrade);

      expect(await serviceProviderDetailPage.getCriminalRecordInput()).toEqual(criminalRecord);

      expect(await serviceProviderDetailPage.getLocationInput()).toEqual(location);
    }
  });

  it('should delete last ServiceProvider', async () => {
    serviceProviderDetailPage = new ServiceProviderDetailPage();
    if (isVisible && (await serviceProviderDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await serviceProviderDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(serviceProviderComponentsPage.title), 3000);
      expect(await serviceProviderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await serviceProviderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ServiceProviders tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
