import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { VideoPostComponentsPage, VideoPostDetailPage, VideoPostUpdatePage } from './video-post.po';

describe('VideoPost e2e test', () => {
  let loginPage: LoginPage;
  let videoPostComponentsPage: VideoPostComponentsPage;
  let videoPostUpdatePage: VideoPostUpdatePage;
  let videoPostDetailPage: VideoPostDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Video Posts';
  const SUBCOMPONENT_TITLE = 'Video Post';
  let lastElement: any;
  let isVisible = false;

  const duration = '10';

  const content = 'contentUrl';


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

  it('should load VideoPosts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'VideoPost')
      .first()
      .click();

    videoPostComponentsPage = new VideoPostComponentsPage();
    await browser.wait(ec.visibilityOf(videoPostComponentsPage.title), 5000);
    expect(await videoPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(videoPostComponentsPage.entities.get(0)), ec.visibilityOf(videoPostComponentsPage.noResult)),
      5000
    );
  });

  it('should create VideoPost', async () => {
    initNumberOfEntities = await videoPostComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(videoPostComponentsPage.createButton), 5000);
    await videoPostComponentsPage.clickOnCreateButton();
    videoPostUpdatePage = new VideoPostUpdatePage();
    await browser.wait(ec.visibilityOf(videoPostUpdatePage.pageTitle), 1000);
    expect(await videoPostUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await videoPostUpdatePage.setContentInput(content);
    await videoPostUpdatePage.setDurationInput(duration);

    await videoPostUpdatePage.save();
    await browser.wait(ec.visibilityOf(videoPostComponentsPage.title), 1000);
    expect(await videoPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await videoPostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last VideoPost', async () => {
    videoPostComponentsPage = new VideoPostComponentsPage();
    await browser.wait(ec.visibilityOf(videoPostComponentsPage.title), 5000);
    lastElement = await videoPostComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last VideoPost', async () => {
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

  it('should view the last VideoPost', async () => {
    videoPostDetailPage = new VideoPostDetailPage();
    if (isVisible && (await videoPostDetailPage.pageTitle.isDisplayed())) {
      expect(await videoPostDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await videoPostDetailPage.getContentInput()).toEqual(content);

      expect(await videoPostDetailPage.getDurationInput()).toEqual(duration);
    }
  });

  it('should delete last VideoPost', async () => {
    videoPostDetailPage = new VideoPostDetailPage();
    if (isVisible && (await videoPostDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await videoPostDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(videoPostComponentsPage.title), 3000);
      expect(await videoPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await videoPostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish VideoPosts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
