import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { LikeComponentsPage, LikeDetailPage, LikeUpdatePage } from './like.po';

describe('Like e2e test', () => {
  let loginPage: LoginPage;
  let likeComponentsPage: LikeComponentsPage;
  let likeUpdatePage: LikeUpdatePage;
  let likeDetailPage: LikeDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Likes';
  const SUBCOMPONENT_TITLE = 'Like';
  let lastElement: any;
  let isVisible = false;

  const amount = '10';

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

  it('should load Likes', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Like')
      .first()
      .click();

    likeComponentsPage = new LikeComponentsPage();
    await browser.wait(ec.visibilityOf(likeComponentsPage.title), 5000);
    expect(await likeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(likeComponentsPage.entities.get(0)), ec.visibilityOf(likeComponentsPage.noResult)), 5000);
  });

  it('should create Like', async () => {
    initNumberOfEntities = await likeComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(likeComponentsPage.createButton), 5000);
    await likeComponentsPage.clickOnCreateButton();
    likeUpdatePage = new LikeUpdatePage();
    await browser.wait(ec.visibilityOf(likeUpdatePage.pageTitle), 1000);
    expect(await likeUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await likeUpdatePage.setAmountInput(amount);

    await likeUpdatePage.save();
    await browser.wait(ec.visibilityOf(likeComponentsPage.title), 1000);
    expect(await likeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await likeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Like', async () => {
    likeComponentsPage = new LikeComponentsPage();
    await browser.wait(ec.visibilityOf(likeComponentsPage.title), 5000);
    lastElement = await likeComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Like', async () => {
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

  it('should view the last Like', async () => {
    likeDetailPage = new LikeDetailPage();
    if (isVisible && (await likeDetailPage.pageTitle.isDisplayed())) {
      expect(await likeDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await likeDetailPage.getAmountInput()).toEqual(amount);
    }
  });

  it('should delete last Like', async () => {
    likeDetailPage = new LikeDetailPage();
    if (isVisible && (await likeDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await likeDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(likeComponentsPage.title), 3000);
      expect(await likeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await likeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Likes tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
