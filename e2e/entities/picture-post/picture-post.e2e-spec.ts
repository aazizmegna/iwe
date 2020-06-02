import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { PicturePostComponentsPage, PicturePostDetailPage, PicturePostUpdatePage } from './picture-post.po';

describe('PicturePost e2e test', () => {
  let loginPage: LoginPage;
  let picturePostComponentsPage: PicturePostComponentsPage;
  let picturePostUpdatePage: PicturePostUpdatePage;
  let picturePostDetailPage: PicturePostDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Picture Posts';
  const SUBCOMPONENT_TITLE = 'Picture Post';
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

  it('should load PicturePosts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'PicturePost')
      .first()
      .click();

    picturePostComponentsPage = new PicturePostComponentsPage();
    await browser.wait(ec.visibilityOf(picturePostComponentsPage.title), 5000);
    expect(await picturePostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(picturePostComponentsPage.entities.get(0)), ec.visibilityOf(picturePostComponentsPage.noResult)),
      5000
    );
  });

  it('should create PicturePost', async () => {
    initNumberOfEntities = await picturePostComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(picturePostComponentsPage.createButton), 5000);
    await picturePostComponentsPage.clickOnCreateButton();
    picturePostUpdatePage = new PicturePostUpdatePage();
    await browser.wait(ec.visibilityOf(picturePostUpdatePage.pageTitle), 1000);
    expect(await picturePostUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await picturePostUpdatePage.setContentInput(content);

    await picturePostUpdatePage.save();
    await browser.wait(ec.visibilityOf(picturePostComponentsPage.title), 1000);
    expect(await picturePostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await picturePostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last PicturePost', async () => {
    picturePostComponentsPage = new PicturePostComponentsPage();
    await browser.wait(ec.visibilityOf(picturePostComponentsPage.title), 5000);
    lastElement = await picturePostComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last PicturePost', async () => {
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

  it('should view the last PicturePost', async () => {
    picturePostDetailPage = new PicturePostDetailPage();
    if (isVisible && (await picturePostDetailPage.pageTitle.isDisplayed())) {
      expect(await picturePostDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await picturePostDetailPage.getContentInput()).toEqual(content);
    }
  });

  it('should delete last PicturePost', async () => {
    picturePostDetailPage = new PicturePostDetailPage();
    if (isVisible && (await picturePostDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await picturePostDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(picturePostComponentsPage.title), 3000);
      expect(await picturePostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await picturePostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish PicturePosts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
