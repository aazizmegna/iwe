import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ConnectionComponentsPage, ConnectionDetailPage, ConnectionUpdatePage } from './connection.po';

describe('Connection e2e test', () => {
  let loginPage: LoginPage;
  let connectionComponentsPage: ConnectionComponentsPage;
  let connectionUpdatePage: ConnectionUpdatePage;
  let connectionDetailPage: ConnectionDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Connections';
  const SUBCOMPONENT_TITLE = 'Connection';
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

  it('should load Connections', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Connection')
      .first()
      .click();

    connectionComponentsPage = new ConnectionComponentsPage();
    await browser.wait(ec.visibilityOf(connectionComponentsPage.title), 5000);
    expect(await connectionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(connectionComponentsPage.entities.get(0)), ec.visibilityOf(connectionComponentsPage.noResult)),
      5000
    );
  });

  it('should create Connection', async () => {
    initNumberOfEntities = await connectionComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(connectionComponentsPage.createButton), 5000);
    await connectionComponentsPage.clickOnCreateButton();
    connectionUpdatePage = new ConnectionUpdatePage();
    await browser.wait(ec.visibilityOf(connectionUpdatePage.pageTitle), 1000);
    expect(await connectionUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await connectionUpdatePage.save();
    await browser.wait(ec.visibilityOf(connectionComponentsPage.title), 1000);
    expect(await connectionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await connectionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Connection', async () => {
    connectionComponentsPage = new ConnectionComponentsPage();
    await browser.wait(ec.visibilityOf(connectionComponentsPage.title), 5000);
    lastElement = await connectionComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Connection', async () => {
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

  it('should view the last Connection', async () => {
    connectionDetailPage = new ConnectionDetailPage();
    if (isVisible && (await connectionDetailPage.pageTitle.isDisplayed())) {
      expect(await connectionDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);
    }
  });

  it('should delete last Connection', async () => {
    connectionDetailPage = new ConnectionDetailPage();
    if (isVisible && (await connectionDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await connectionDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(connectionComponentsPage.title), 3000);
      expect(await connectionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await connectionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Connections tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
