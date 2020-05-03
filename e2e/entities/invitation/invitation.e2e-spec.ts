import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { InvitationComponentsPage, InvitationDetailPage, InvitationUpdatePage } from './invitation.po';

describe('Invitation e2e test', () => {
  let loginPage: LoginPage;
  let invitationComponentsPage: InvitationComponentsPage;
  let invitationUpdatePage: InvitationUpdatePage;
  let invitationDetailPage: InvitationDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Invitations';
  const SUBCOMPONENT_TITLE = 'Invitation';
  let lastElement: any;
  let isVisible = false;

  const sentTo = 'sentTo';
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

  it('should load Invitations', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Invitation')
      .first()
      .click();

    invitationComponentsPage = new InvitationComponentsPage();
    await browser.wait(ec.visibilityOf(invitationComponentsPage.title), 5000);
    expect(await invitationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(invitationComponentsPage.entities.get(0)), ec.visibilityOf(invitationComponentsPage.noResult)),
      5000
    );
  });

  it('should create Invitation', async () => {
    initNumberOfEntities = await invitationComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(invitationComponentsPage.createButton), 5000);
    await invitationComponentsPage.clickOnCreateButton();
    invitationUpdatePage = new InvitationUpdatePage();
    await browser.wait(ec.visibilityOf(invitationUpdatePage.pageTitle), 1000);
    expect(await invitationUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await invitationUpdatePage.setSentToInput(sentTo);
    await invitationUpdatePage.setContentInput(content);

    await invitationUpdatePage.save();
    await browser.wait(ec.visibilityOf(invitationComponentsPage.title), 1000);
    expect(await invitationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await invitationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Invitation', async () => {
    invitationComponentsPage = new InvitationComponentsPage();
    await browser.wait(ec.visibilityOf(invitationComponentsPage.title), 5000);
    lastElement = await invitationComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Invitation', async () => {
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

  it('should view the last Invitation', async () => {
    invitationDetailPage = new InvitationDetailPage();
    if (isVisible && (await invitationDetailPage.pageTitle.isDisplayed())) {
      expect(await invitationDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await invitationDetailPage.getSentToInput()).toEqual(sentTo);

      expect(await invitationDetailPage.getContentInput()).toEqual(content);
    }
  });

  it('should delete last Invitation', async () => {
    invitationDetailPage = new InvitationDetailPage();
    if (isVisible && (await invitationDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await invitationDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(invitationComponentsPage.title), 3000);
      expect(await invitationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await invitationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Invitations tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
