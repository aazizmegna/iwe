import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { BookingComponentsPage, BookingDetailPage, BookingUpdatePage } from './booking.po';

describe('Booking e2e test', () => {
  let loginPage: LoginPage;
  let bookingComponentsPage: BookingComponentsPage;
  let bookingUpdatePage: BookingUpdatePage;
  let bookingDetailPage: BookingDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Bookings';
  const SUBCOMPONENT_TITLE = 'Booking';
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

  it('should load Bookings', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Booking')
      .first()
      .click();

    bookingComponentsPage = new BookingComponentsPage();
    await browser.wait(ec.visibilityOf(bookingComponentsPage.title), 5000);
    expect(await bookingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(bookingComponentsPage.entities.get(0)), ec.visibilityOf(bookingComponentsPage.noResult)),
      5000
    );
  });

  it('should create Booking', async () => {
    initNumberOfEntities = await bookingComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(bookingComponentsPage.createButton), 5000);
    await bookingComponentsPage.clickOnCreateButton();
    bookingUpdatePage = new BookingUpdatePage();
    await browser.wait(ec.visibilityOf(bookingUpdatePage.pageTitle), 1000);
    expect(await bookingUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await bookingUpdatePage.save();
    await browser.wait(ec.visibilityOf(bookingComponentsPage.title), 1000);
    expect(await bookingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await bookingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Booking', async () => {
    bookingComponentsPage = new BookingComponentsPage();
    await browser.wait(ec.visibilityOf(bookingComponentsPage.title), 5000);
    lastElement = await bookingComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Booking', async () => {
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

  it('should view the last Booking', async () => {
    bookingDetailPage = new BookingDetailPage();
    if (isVisible && (await bookingDetailPage.pageTitle.isDisplayed())) {
      expect(await bookingDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);
    }
  });

  it('should delete last Booking', async () => {
    bookingDetailPage = new BookingDetailPage();
    if (isVisible && (await bookingDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await bookingDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(bookingComponentsPage.title), 3000);
      expect(await bookingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await bookingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Bookings tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
