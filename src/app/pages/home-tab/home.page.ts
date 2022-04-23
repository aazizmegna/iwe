import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, Platform} from '@ionic/angular';
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
import {ServiceProviderService} from '../entities/service-provider';
import {LocalStorageService} from 'ngx-webstorage';
import {ServiceConsumerService} from '../entities/service-consumer';
import {WonderPush} from '@awesome-cordova-plugins/wonderpush/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;
  feeds: Home[];
  isLoading = false;
  loading;

  constructor(public route: Router, private accountService: AccountService, private loginService: LoginService,
              private homeService: HomeService, public plt: Platform, public alertController: AlertController,
              private serviceProviderService: ServiceProviderService, private $localstorage: LocalStorageService,
              private serviceConsumerService: ServiceConsumerService, public loadingController: LoadingController,
              private wonderPush: WonderPush
  ) {
  }

  async ngOnInit() {
    // this.accountService.identity().then((account) => {
    //   if (account === null) {
    //     this.goBackToHomePage();
    //   } else {
    //     this.account = account;
    //   }
    // });

    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.wonderPush.setUserId(this.$localstorage.retrieve('email'));
  }

  async presentLoading() {
    if (this.isLoading) {
      await this.loading.present();
    }
    if (!this.isLoading) {
      await this.loading.dismiss();
    }
  }

  ionViewWillEnter() {
    this.loadFeeds();
  }

  trackId(index: number, item: Home) {
    return item.id;
  }

  async loadFeeds(refresher?) {
    const provider = await this.serviceProviderService.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    const consumer = await this.serviceConsumerService.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    let userId;
    if (consumer && !provider) {
      userId = consumer.body.id.toString();
    } else if (!consumer && provider) {
      userId = provider.body.id.toString();
    }
    this.isLoading = true;
    await this.presentLoading();
    this.feeds = await this.homeService.loadAllFreemiumPostsWithBusinessUsersPosts(userId, true);
    this.isLoading = false;
    await this.presentLoading();
  }

  // isAuthenticated() {
  //   return this.accountService.isAuthenticated();
  // }

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
