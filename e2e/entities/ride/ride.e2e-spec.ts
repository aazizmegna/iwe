import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { RideComponentsPage, RideDetailPage, RideUpdatePage } from './ride.po';

describe('Ride e2e test', () => {
  let loginPage: LoginPage;
  let rideComponentsPage: RideComponentsPage;
  let rideUpdatePage: RideUpdatePage;
  let rideDetailPage: RideDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Rides';
  const SUBCOMPONENT_TITLE = 'Ride';
  let lastElement: any;
  let isVisible = false;

  const departure = 'departure';
  const destination = 'destination';

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

  it('should load Rides', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Ride')
      .first()
      .click();

    rideComponentsPage = new RideComponentsPage();
    await browser.wait(ec.visibilityOf(rideComponentsPage.title), 5000);
    expect(await rideComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(rideComponentsPage.entities.get(0)), ec.visibilityOf(rideComponentsPage.noResult)), 5000);
  });

  it('should create Ride', async () => {
    initNumberOfEntities = await rideComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(rideComponentsPage.createButton), 5000);
    await rideComponentsPage.clickOnCreateButton();
    rideUpdatePage = new RideUpdatePage();
    await browser.wait(ec.visibilityOf(rideUpdatePage.pageTitle), 1000);
    expect(await rideUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await rideUpdatePage.setDepartureInput(departure);
    await rideUpdatePage.setDestinationInput(destination);

    await rideUpdatePage.save();
    await browser.wait(ec.visibilityOf(rideComponentsPage.title), 1000);
    expect(await rideComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await rideComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Ride', async () => {
    rideComponentsPage = new RideComponentsPage();
    await browser.wait(ec.visibilityOf(rideComponentsPage.title), 5000);
    lastElement = await rideComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Ride', async () => {
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

  it('should view the last Ride', async () => {
    rideDetailPage = new RideDetailPage();
    if (isVisible && (await rideDetailPage.pageTitle.isDisplayed())) {
      expect(await rideDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await rideDetailPage.getDepartureInput()).toEqual(departure);

      expect(await rideDetailPage.getDestinationInput()).toEqual(destination);
    }
  });

  it('should delete last Ride', async () => {
    rideDetailPage = new RideDetailPage();
    if (isVisible && (await rideDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await rideDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(rideComponentsPage.title), 3000);
      expect(await rideComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await rideComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Rides tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
