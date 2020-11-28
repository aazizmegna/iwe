import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { MarketingPostComponentsPage, MarketingPostDetailPage, MarketingPostUpdatePage } from './marketing-post.po';

describe('MarketingPost e2e test', () => {
  let loginPage: LoginPage;
  let marketingPostComponentsPage: MarketingPostComponentsPage;
  let marketingPostUpdatePage: MarketingPostUpdatePage;
  let marketingPostDetailPage: MarketingPostDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Marketing Posts';
  const SUBCOMPONENT_TITLE = 'Marketing Post';
  let lastElement: any;
  let isVisible = false;

  const price = '10';

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

  it('should load MarketingPosts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'MarketingPost')
      .first()
      .click();

    marketingPostComponentsPage = new MarketingPostComponentsPage();
    await browser.wait(ec.visibilityOf(marketingPostComponentsPage.title), 5000);
    expect(await marketingPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(marketingPostComponentsPage.entities.get(0)), ec.visibilityOf(marketingPostComponentsPage.noResult)),
      5000
    );
  });

  it('should create MarketingPost', async () => {
    initNumberOfEntities = await marketingPostComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(marketingPostComponentsPage.createButton), 5000);
    await marketingPostComponentsPage.clickOnCreateButton();
    marketingPostUpdatePage = new MarketingPostUpdatePage();
    await browser.wait(ec.visibilityOf(marketingPostUpdatePage.pageTitle), 1000);
    expect(await marketingPostUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await marketingPostUpdatePage.setPriceInput(price);

    await marketingPostUpdatePage.save();
    await browser.wait(ec.visibilityOf(marketingPostComponentsPage.title), 1000);
    expect(await marketingPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await marketingPostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last MarketingPost', async () => {
    marketingPostComponentsPage = new MarketingPostComponentsPage();
    await browser.wait(ec.visibilityOf(marketingPostComponentsPage.title), 5000);
    lastElement = await marketingPostComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last MarketingPost', async () => {
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

  it('should view the last MarketingPost', async () => {
    marketingPostDetailPage = new MarketingPostDetailPage();
    if (isVisible && (await marketingPostDetailPage.pageTitle.isDisplayed())) {
      expect(await marketingPostDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await marketingPostDetailPage.getPriceInput()).toEqual(price);
    }
  });

  it('should delete last MarketingPost', async () => {
    marketingPostDetailPage = new MarketingPostDetailPage();
    if (isVisible && (await marketingPostDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await marketingPostDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(marketingPostComponentsPage.title), 3000);
      expect(await marketingPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await marketingPostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish MarketingPosts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
