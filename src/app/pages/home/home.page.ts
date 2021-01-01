import { Component, OnInit } from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Account } from 'src/model/account.model';
import {HomeService} from './home.service';
import {Home} from './home.model';
import {Service} from '../entities/service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;
  feeds: Home[];

  constructor(public navController: NavController, private accountService: AccountService, private loginService: LoginService,
              private homeService: HomeService, public plt: Platform) {
  }

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
    this.feeds = await this.homeService.loadAllFreemiumPostsWithBusinessUsersPosts();
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logout() {
    this.loginService.logout();
    this.goBackToHomePage();
  }

  private goBackToHomePage(): void {
    this.navController.navigateBack('');
  }
}
