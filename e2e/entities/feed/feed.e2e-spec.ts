import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { FeedComponentsPage, FeedDetailPage, FeedUpdatePage } from './feed.po';

describe('Feed e2e test', () => {
  let loginPage: LoginPage;
  let feedComponentsPage: FeedComponentsPage;
  let feedUpdatePage: FeedUpdatePage;
  let feedDetailPage: FeedDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Feeds';
  const SUBCOMPONENT_TITLE = 'Feed';
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

  it('should load Feeds', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Feed')
      .first()
      .click();

    feedComponentsPage = new FeedComponentsPage();
    await browser.wait(ec.visibilityOf(feedComponentsPage.title), 5000);
    expect(await feedComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(feedComponentsPage.entities.get(0)), ec.visibilityOf(feedComponentsPage.noResult)), 5000);
  });

  it('should create Feed', async () => {
    initNumberOfEntities = await feedComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(feedComponentsPage.createButton), 5000);
    await feedComponentsPage.clickOnCreateButton();
    feedUpdatePage = new FeedUpdatePage();
    await browser.wait(ec.visibilityOf(feedUpdatePage.pageTitle), 1000);
    expect(await feedUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await feedUpdatePage.save();
    await browser.wait(ec.visibilityOf(feedComponentsPage.title), 1000);
    expect(await feedComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await feedComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Feed', async () => {
    feedComponentsPage = new FeedComponentsPage();
    await browser.wait(ec.visibilityOf(feedComponentsPage.title), 5000);
    lastElement = await feedComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Feed', async () => {
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

  it('should view the last Feed', async () => {
    feedDetailPage = new FeedDetailPage();
    if (isVisible && (await feedDetailPage.pageTitle.isDisplayed())) {
      expect(await feedDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);
    }
  });

  it('should delete last Feed', async () => {
    feedDetailPage = new FeedDetailPage();
    if (isVisible && (await feedDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await feedDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(feedComponentsPage.title), 3000);
      expect(await feedComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await feedComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Feeds tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
