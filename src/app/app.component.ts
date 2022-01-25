import {Component} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {MenuController, Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {ImageLoaderConfigService} from 'ionic-image-loader';
import {LoginService} from './services/login/login.service';
import {Router} from '@angular/router';
import {AuthServerProvider} from './services/auth/auth-jwt.service';
import OneSignal from 'onesignal-cordova-plugin';
import {LocalStorageService} from 'ngx-webstorage';
import {DeviceAccounts} from '@awesome-cordova-plugins/device-accounts/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private imageLoaderConfigService: ImageLoaderConfigService,
    private loginService: LoginService,
    public route: Router,
    private menuCtrl: MenuController,
    private authProvider: AuthServerProvider,
    public deviceAccounts: DeviceAccounts
  ) {
    this.initializeApp();
    this.imageLoaderConfigService.setImageReturnType('base64');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.OneSignalInit();
    });
    this.initTranslate();
  }

  // Call this function when your app starts
  OneSignalInit(): void {
    // Uncomment to set OneSignal device logging to VERBOSE
    // OneSignal.setLogLevel(6, 0);

    // NOTE: Update the setAppId value below with your OneSignal AppId.
    OneSignal.setAppId('9f48173a-9e01-43ed-9137-0048fa051981');
    OneSignal.getDeviceState((stateChanges) => {
      console.log('OneSignal getDeviceState: ' + JSON.stringify(stateChanges));

    });

    // Setting External User Id with Callback Available in SDK Version 2.11.2+
    this.deviceAccounts.getEmail()
      .then(emailAddress => {
        console.log(emailAddress);
        OneSignal.setExternalUserId(emailAddress, (results) => {
          // The results will contain push and email success statuses
          console.log('Results of setting external user id');
          console.log(results);

          // Push can be expected in almost every situation with a success status, but
          // as a pre-caution its good to verify it exists
          // @ts-ignore
          if (results.push && results.push.success) {
            console.log('Results of setting external user id push status:');
            // @ts-ignore
            console.log(results.push.success);
          }

          // Verify the email is set or check that the results have an email success status
          // @ts-ignore
          if (results.email && results.email.success) {
            console.log('Results of setting external user id email status:');
            // @ts-ignore
            console.log(results.email.success);
          }

          // Verify the number is set or check that the results have an sms success status
          // @ts-ignore
          if (results.sms && results.sms.success) {
            console.log('Results of setting external user id sms status:');
            // @ts-ignore
            console.log(results.sms.success);
          }
        });

      })
      .catch(error => console.error(error));

    OneSignal.setNotificationOpenedHandler((jsonData) => {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });

    // iOS - Prompts the user for notification permissions.
    // * Since this shows a generic native prompt, we recommend instead using
    // an In-App Message to prompt for notification permission (See step 6) to better communicate
    // to your users what notifications they will get.
    OneSignal.promptForPushNotificationsWithUserResponse(accepted => {
      console.log('User accepted notifications: ' + accepted);
    });
  }

  initTranslate() {
    const enLang = 'en';

    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang(enLang);

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use(enLang); // Set your language here
    }

    // this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
    //   this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    // });
  }

  logout() {
    this.loginService.logout();
    this.goBackToHomePage();
    this.menuCtrl.close('main-menu');
  }

  private goBackToHomePage(): void {
    this.route.navigate(['']);
  }

  private goBackToListBookingsPage(): void {
    this.route.navigate(['list-bookings']);
    this.menuCtrl.close('main-menu');
  }

  private goBackToPersonalInfoPage(): void {
    this.route.navigate(['personal-information']);
    this.menuCtrl.close('main-menu');
  }
}
