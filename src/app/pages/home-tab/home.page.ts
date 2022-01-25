import {Component, OnInit} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {AccountService} from 'src/app/services/auth/account.service';
import {LoginService} from 'src/app/services/login/login.service';
import {Account} from 'src/model/account.model';
import {HomeService} from './home.service';
import {Home} from './home.model';
import {Service} from '../entities/service';
import {SearchServicesModel} from '../search-services-tab/search-services.model';
import {BookingProvider} from './booking/booking.provider';
import {FeedsProvider} from './feeds.provider';
import {Router} from '@angular/router';
import {Feed} from '../entities/feed';
import {FCM, NotificationData} from '@ionic-native/fcm/ngx';
import {AlertController} from '@ionic/angular';
import OneSignal from 'onesignal-cordova-plugin';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;
  feeds: Home[];

  constructor(public route: Router, private accountService: AccountService, private loginService: LoginService,
              private homeService: HomeService, public plt: Platform, private fcm: FCM, public alertController: AlertController) {

    plt.ready().then(() => {
    });
    // this.plt.ready()
    //   .then(async () => {
    //     await this.fcm.subscribeToTopic('enappd');
    //     this.fcm.onNotification().subscribe(async (data: NotificationData) => {
    //       if (data.wasTapped) {
    //           await this.route.navigate([data.calls_page, data.msg]);
    //           const alert = await this.alertController.create({
    //           cssClass: 'my-custom-class',
    //           header: 'Alert',
    //           subHeader: 'Subtitle',
    //           message: 'This is an alert message.',
    //           buttons: ['OK']
    //         });
    //
    //           await alert.present();
    //
    //           const { role } = await alert.onDidDismiss();
    //           console.log('onDidDismiss resolved with role', role);
    //           console.log('Received in background');
    //       } else {
    //         console.log('Received in foreground');
    //       }
    //     });
    //
    //     this.fcm.onTokenRefresh().subscribe(token => {
    //       // Register your new token in your back-end if you want
    //       // backend.registerToken(token);
    //     });
    //   });
  }




  // async subscribeToTopic() {
  //   await this.fcm.subscribeToTopic('enappd');
  // }
  //
  // getToken() {
  //   this.fcm.getToken().then(token => {
  //     // Register your new token in your back-end if you want
  //     // backend.registerToken(token);
  //   });
  // }
  //
  // unsubscribeFromTopic() {
  //   this.fcm.unsubscribeFromTopic('enappd');
  // }

  ngOnInit() {
    this.accountService.identity().then((account) => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
      }
    });
  }

  ionViewWillEnter() {
    this.loadFeeds();
  }

  trackId(index: number, item: Home) {
    return item.id;
  }

  async loadFeeds(refresher?) {
    this.feeds = await this.homeService.loadAllFreemiumPostsWithBusinessUsersPosts(undefined, true);
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logout() {
    this.loginService.logout();
    this.goBackToHomePage();
  }

  private goBackToHomePage(): void {
    this.route.navigate(['']);
  }

  openSingle(feed: Home) {
    if (feed.price) {
      this.route.navigate(['/tabs/home/single/' + feed.serviceProvider.id.toString() + '/view']);
    }
  }

  openChatPage(feed: Home) {
    if (feed.price) {
      this.route.navigate(['/tabs/home/chat/' + feed.serviceProvider.id.toString()]);
    }
  }

  initiateFollowing() {

  }
}
