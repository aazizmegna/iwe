import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { SnapshotPostComponentsPage, SnapshotPostDetailPage, SnapshotPostUpdatePage } from './snapshot-post.po';

describe('SnapshotPost e2e test', () => {
  let loginPage: LoginPage;
  let snapshotPostComponentsPage: SnapshotPostComponentsPage;
  let snapshotPostUpdatePage: SnapshotPostUpdatePage;
  let snapshotPostDetailPage: SnapshotPostDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Snapshot Posts';
  const SUBCOMPONENT_TITLE = 'Snapshot Post';
  let lastElement: any;
  let isVisible = false;

  const duration = '10';

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

  it('should load SnapshotPosts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'SnapshotPost')
      .first()
      .click();

    snapshotPostComponentsPage = new SnapshotPostComponentsPage();
    await browser.wait(ec.visibilityOf(snapshotPostComponentsPage.title), 5000);
    expect(await snapshotPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(snapshotPostComponentsPage.entities.get(0)), ec.visibilityOf(snapshotPostComponentsPage.noResult)),
      5000
    );
  });

  it('should create SnapshotPost', async () => {
    initNumberOfEntities = await snapshotPostComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(snapshotPostComponentsPage.createButton), 5000);
    await snapshotPostComponentsPage.clickOnCreateButton();
    snapshotPostUpdatePage = new SnapshotPostUpdatePage();
    await browser.wait(ec.visibilityOf(snapshotPostUpdatePage.pageTitle), 1000);
    expect(await snapshotPostUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await snapshotPostUpdatePage.setContentUrlInput(contentUrl);
    await snapshotPostUpdatePage.setDurationInput(duration);

    await snapshotPostUpdatePage.save();
    await browser.wait(ec.visibilityOf(snapshotPostComponentsPage.title), 1000);
    expect(await snapshotPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await snapshotPostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last SnapshotPost', async () => {
    snapshotPostComponentsPage = new SnapshotPostComponentsPage();
    await browser.wait(ec.visibilityOf(snapshotPostComponentsPage.title), 5000);
    lastElement = await snapshotPostComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last SnapshotPost', async () => {
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

  it('should view the last SnapshotPost', async () => {
    snapshotPostDetailPage = new SnapshotPostDetailPage();
    if (isVisible && (await snapshotPostDetailPage.pageTitle.isDisplayed())) {
      expect(await snapshotPostDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await snapshotPostDetailPage.getContentUrlInput()).toEqual(contentUrl);

      expect(await snapshotPostDetailPage.getDurationInput()).toEqual(duration);
    }
  });

  it('should delete last SnapshotPost', async () => {
    snapshotPostDetailPage = new SnapshotPostDetailPage();
    if (isVisible && (await snapshotPostDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await snapshotPostDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(snapshotPostComponentsPage.title), 3000);
      expect(await snapshotPostComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await snapshotPostComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish SnapshotPosts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
