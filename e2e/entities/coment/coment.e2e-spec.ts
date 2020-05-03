import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ComentComponentsPage, ComentDetailPage, ComentUpdatePage } from './coment.po';

describe('Coment e2e test', () => {
  let loginPage: LoginPage;
  let comentComponentsPage: ComentComponentsPage;
  let comentUpdatePage: ComentUpdatePage;
  let comentDetailPage: ComentDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Coments';
  const SUBCOMPONENT_TITLE = 'Coment';
  let lastElement: any;
  let isVisible = false;

  const content = 'content';
  const pictureUrl = 'pictureUrl';

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

  it('should load Coments', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Coment')
      .first()
      .click();

    comentComponentsPage = new ComentComponentsPage();
    await browser.wait(ec.visibilityOf(comentComponentsPage.title), 5000);
    expect(await comentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(comentComponentsPage.entities.get(0)), ec.visibilityOf(comentComponentsPage.noResult)), 5000);
  });

  it('should create Coment', async () => {
    initNumberOfEntities = await comentComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(comentComponentsPage.createButton), 5000);
    await comentComponentsPage.clickOnCreateButton();
    comentUpdatePage = new ComentUpdatePage();
    await browser.wait(ec.visibilityOf(comentUpdatePage.pageTitle), 1000);
    expect(await comentUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await comentUpdatePage.setContentInput(content);
    await comentUpdatePage.setPictureUrlInput(pictureUrl);

    await comentUpdatePage.save();
    await browser.wait(ec.visibilityOf(comentComponentsPage.title), 1000);
    expect(await comentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await comentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Coment', async () => {
    comentComponentsPage = new ComentComponentsPage();
    await browser.wait(ec.visibilityOf(comentComponentsPage.title), 5000);
    lastElement = await comentComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Coment', async () => {
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

  it('should view the last Coment', async () => {
    comentDetailPage = new ComentDetailPage();
    if (isVisible && (await comentDetailPage.pageTitle.isDisplayed())) {
      expect(await comentDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await comentDetailPage.getContentInput()).toEqual(content);

      expect(await comentDetailPage.getPictureUrlInput()).toEqual(pictureUrl);
    }
  });

  it('should delete last Coment', async () => {
    comentDetailPage = new ComentDetailPage();
    if (isVisible && (await comentDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await comentDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(comentComponentsPage.title), 3000);
      expect(await comentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await comentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Coments tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
