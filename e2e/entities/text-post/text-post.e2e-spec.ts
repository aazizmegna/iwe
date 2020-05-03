import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { TextPostComponentsPage, TextPostDetailPage, TextPostUpdatePage } from './text-post.po';

describe('TextPost e2e test', () => {
  let loginPage: LoginPage;
  let textPostComponentsPage: TextPostComponentsPage;
  let textPostUpdatePage: TextPostUpdatePage;
  let textPostDetailPage: TextPostDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Text Posts';
  const SUBCOMPONENT_TITLE = 'Text Post';
  let lastElement: any;
  let isVisible = false;

  const content = 'content';

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

  it('should load TextPosts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'TextPost')
      .first()
      .click();

    textPostComponentsPage = new TextPostComponentsPage();
    await browser.wait(ec.visibilityOf(textPostComponentsPage.title), 5000);
    expect(await textPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(textPostComponentsPage.entities.get(0)), ec.visibilityOf(textPostComponentsPage.noResult)),
      5000
    );
  });

  it('should create TextPost', async () => {
    initNumberOfEntities = await textPostComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(textPostComponentsPage.createButton), 5000);
    await textPostComponentsPage.clickOnCreateButton();
    textPostUpdatePage = new TextPostUpdatePage();
    await browser.wait(ec.visibilityOf(textPostUpdatePage.pageTitle), 1000);
    expect(await textPostUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await textPostUpdatePage.setContentInput(content);

    await textPostUpdatePage.save();
    await browser.wait(ec.visibilityOf(textPostComponentsPage.title), 1000);
    expect(await textPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await textPostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last TextPost', async () => {
    textPostComponentsPage = new TextPostComponentsPage();
    await browser.wait(ec.visibilityOf(textPostComponentsPage.title), 5000);
    lastElement = await textPostComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last TextPost', async () => {
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

  it('should view the last TextPost', async () => {
    textPostDetailPage = new TextPostDetailPage();
    if (isVisible && (await textPostDetailPage.pageTitle.isDisplayed())) {
      expect(await textPostDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await textPostDetailPage.getContentInput()).toEqual(content);
    }
  });

  it('should delete last TextPost', async () => {
    textPostDetailPage = new TextPostDetailPage();
    if (isVisible && (await textPostDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await textPostDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(textPostComponentsPage.title), 3000);
      expect(await textPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await textPostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish TextPosts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
