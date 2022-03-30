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
import {UserService} from './services/user/user.service';


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
    private userService: UserService,
    public route: Router,
    private menuCtrl: MenuController,
    private authProvider: AuthServerProvider,
    public deviceAccounts: DeviceAccounts,
    private $localStorage: LocalStorageService
  ) {
    this.initializeApp();
    this.imageLoaderConfigService.setImageReturnType('base64');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
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
