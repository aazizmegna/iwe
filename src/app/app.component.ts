import {Component, NgZone, ViewChild} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {MenuController, NavController, Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {ImageLoaderConfigService} from 'ionic-image-loader';
import {LoginService} from './services/login/login.service';
import {Router} from '@angular/router';
import {AuthServerProvider} from './services/auth/auth-jwt.service';
import {LocalStorageService} from 'ngx-webstorage';
import {DeviceAccounts} from '@awesome-cordova-plugins/device-accounts/ngx';
import {UserService} from './services/user/user.service';
import { WonderPush } from '@awesome-cordova-plugins/wonderpush/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import {HomePage} from './pages/home-tab/home.page';
import {LoginPage} from './pages/login/login.page';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  @ViewChild(NavController) navChild: NavController;

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
    private $localStorage: LocalStorageService,
    private wonderPush: WonderPush,
    private deeplinks: Deeplinks,
    private zone: NgZone,
    private router: Router,


  ) {
    this.initializeApp();
    this.imageLoaderConfigService.setImageReturnType('base64');

  }


  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      await this.wonderPush.setLogging(true);
      await this.wonderPush.subscribeToNotifications();
      this.deeplinks.route({
        '/tabs/home/': HomePage,
        '/': LoginPage,
      }).subscribe(match => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        // Create our internal Router path by hand
        const internalPath = `/${match.$route}/`;

        // Run the navigation in the Angular zone
        this.zone.run(() => {
          this.router.navigateByUrl(internalPath);
        });
        console.log('Successfully matched route', match);
      }, nomatch => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
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
    this.$localStorage.clear('email');
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

