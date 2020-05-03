import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { MessageComponentsPage, MessageDetailPage, MessageUpdatePage } from './message.po';

describe('Message e2e test', () => {
  let loginPage: LoginPage;
  let messageComponentsPage: MessageComponentsPage;
  let messageUpdatePage: MessageUpdatePage;
  let messageDetailPage: MessageDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Messages';
  const SUBCOMPONENT_TITLE = 'Message';
  let lastElement: any;
  let isVisible = false;

  const content = 'content';
  const sender = 'sender';
  const receiver = 'receiver';

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

  it('should load Messages', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Message')
      .first()
      .click();

    messageComponentsPage = new MessageComponentsPage();
    await browser.wait(ec.visibilityOf(messageComponentsPage.title), 5000);
    expect(await messageComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(messageComponentsPage.entities.get(0)), ec.visibilityOf(messageComponentsPage.noResult)),
      5000
    );
  });

  it('should create Message', async () => {
    initNumberOfEntities = await messageComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(messageComponentsPage.createButton), 5000);
    await messageComponentsPage.clickOnCreateButton();
    messageUpdatePage = new MessageUpdatePage();
    await browser.wait(ec.visibilityOf(messageUpdatePage.pageTitle), 1000);
    expect(await messageUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await messageUpdatePage.setContentInput(content);
    await messageUpdatePage.setSenderInput(sender);
    await messageUpdatePage.setReceiverInput(receiver);

    await messageUpdatePage.save();
    await browser.wait(ec.visibilityOf(messageComponentsPage.title), 1000);
    expect(await messageComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await messageComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Message', async () => {
    messageComponentsPage = new MessageComponentsPage();
    await browser.wait(ec.visibilityOf(messageComponentsPage.title), 5000);
    lastElement = await messageComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Message', async () => {
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

  it('should view the last Message', async () => {
    messageDetailPage = new MessageDetailPage();
    if (isVisible && (await messageDetailPage.pageTitle.isDisplayed())) {
      expect(await messageDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await messageDetailPage.getContentInput()).toEqual(content);

      expect(await messageDetailPage.getSenderInput()).toEqual(sender);

      expect(await messageDetailPage.getReceiverInput()).toEqual(receiver);
    }
  });

  it('should delete last Message', async () => {
    messageDetailPage = new MessageDetailPage();
    if (isVisible && (await messageDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await messageDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(messageComponentsPage.title), 3000);
      expect(await messageComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await messageComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Messages tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
