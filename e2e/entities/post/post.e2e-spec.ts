import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { PostComponentsPage, PostDetailPage, PostUpdatePage } from './post.po';

describe('Post e2e test', () => {
  let loginPage: LoginPage;
  let postComponentsPage: PostComponentsPage;
  let postUpdatePage: PostUpdatePage;
  let postDetailPage: PostDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Posts';
  const SUBCOMPONENT_TITLE = 'Post';
  let lastElement: any;
  let isVisible = false;

  const location = 'location';
  const description = 'description';

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

  it('should load Posts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Post')
      .first()
      .click();

    postComponentsPage = new PostComponentsPage();
    await browser.wait(ec.visibilityOf(postComponentsPage.title), 5000);
    expect(await postComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(postComponentsPage.entities.get(0)), ec.visibilityOf(postComponentsPage.noResult)), 5000);
  });

  it('should create Post', async () => {
    initNumberOfEntities = await postComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(postComponentsPage.createButton), 5000);
    await postComponentsPage.clickOnCreateButton();
    postUpdatePage = new PostUpdatePage();
    await browser.wait(ec.visibilityOf(postUpdatePage.pageTitle), 1000);
    expect(await postUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await postUpdatePage.setLocationInput(location);
    await postUpdatePage.setDescriptionInput(description);

    await postUpdatePage.save();
    await browser.wait(ec.visibilityOf(postComponentsPage.title), 1000);
    expect(await postComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await postComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Post', async () => {
    postComponentsPage = new PostComponentsPage();
    await browser.wait(ec.visibilityOf(postComponentsPage.title), 5000);
    lastElement = await postComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Post', async () => {
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

  it('should view the last Post', async () => {
    postDetailPage = new PostDetailPage();
    if (isVisible && (await postDetailPage.pageTitle.isDisplayed())) {
      expect(await postDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await postDetailPage.getLocationInput()).toEqual(location);

      expect(await postDetailPage.getDescriptionInput()).toEqual(description);
    }
  });

  it('should delete last Post', async () => {
    postDetailPage = new PostDetailPage();
    if (isVisible && (await postDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await postDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(postComponentsPage.title), 3000);
      expect(await postComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await postComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Posts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
