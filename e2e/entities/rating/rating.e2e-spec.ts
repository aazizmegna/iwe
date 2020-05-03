import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { RatingComponentsPage, RatingDetailPage, RatingUpdatePage } from './rating.po';

describe('Rating e2e test', () => {
  let loginPage: LoginPage;
  let ratingComponentsPage: RatingComponentsPage;
  let ratingUpdatePage: RatingUpdatePage;
  let ratingDetailPage: RatingDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Ratings';
  const SUBCOMPONENT_TITLE = 'Rating';
  let lastElement: any;
  let isVisible = false;

  const rating = '10';

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

  it('should load Ratings', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Rating')
      .first()
      .click();

    ratingComponentsPage = new RatingComponentsPage();
    await browser.wait(ec.visibilityOf(ratingComponentsPage.title), 5000);
    expect(await ratingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(ratingComponentsPage.entities.get(0)), ec.visibilityOf(ratingComponentsPage.noResult)), 5000);
  });

  it('should create Rating', async () => {
    initNumberOfEntities = await ratingComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(ratingComponentsPage.createButton), 5000);
    await ratingComponentsPage.clickOnCreateButton();
    ratingUpdatePage = new RatingUpdatePage();
    await browser.wait(ec.visibilityOf(ratingUpdatePage.pageTitle), 1000);
    expect(await ratingUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await ratingUpdatePage.setRatingInput(rating);

    await ratingUpdatePage.save();
    await browser.wait(ec.visibilityOf(ratingComponentsPage.title), 1000);
    expect(await ratingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await ratingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Rating', async () => {
    ratingComponentsPage = new RatingComponentsPage();
    await browser.wait(ec.visibilityOf(ratingComponentsPage.title), 5000);
    lastElement = await ratingComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Rating', async () => {
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

  it('should view the last Rating', async () => {
    ratingDetailPage = new RatingDetailPage();
    if (isVisible && (await ratingDetailPage.pageTitle.isDisplayed())) {
      expect(await ratingDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await ratingDetailPage.getRatingInput()).toEqual(rating);
    }
  });

  it('should delete last Rating', async () => {
    ratingDetailPage = new RatingDetailPage();
    if (isVisible && (await ratingDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await ratingDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(ratingComponentsPage.title), 3000);
      expect(await ratingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await ratingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Ratings tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
