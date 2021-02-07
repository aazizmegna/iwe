import {Component, OnInit} from '@angular/core';
import {SingleService} from '../home-tab/single/single.service';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {SearchServicesModel} from '../search-services-tab/search-services.model';
import {AuthServerProvider} from '../../services/auth/auth-jwt.service';
import {HomeService} from '../home-tab/home.service';
import {BaseEntity} from '../../../model/base-entity';
import {ServiceProvider} from '../entities/service-provider';
import {ServiceConsumer} from '../entities/service-consumer';
import {Home} from '../home-tab/home.model';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage implements OnInit {
  private servicesModels: Home[];
  private location: string;
  private serviceProviderPicType: string;
  private serviceProviderPic: string;
  private serviceConsumerPicType: string;
  private serviceConsumerPic: string;
  private serviceConsumerUName: string;
  private serviceProviderUName: string;

  constructor(private service: SingleService, private authProvider: AuthServerProvider, private homeService: HomeService) {
  }

  ngOnInit(): void {
  }

  ionViewWillEnter() {
    this.loadUserServices();
  }

  async loadUserServices() {
    // tslint:disable-next-line:max-line-length
    this.servicesModels = await this.homeService.loadAllFreemiumPostsWithBusinessUsersPosts(this.authProvider.user.serviceProviderId, false, false);
    if (this.servicesModels.length === 0) {
      // tslint:disable-next-line:max-line-length
      this.servicesModels = await this.homeService.loadAllFreemiumPostsWithBusinessUsersPosts(this.authProvider.user.serviceConsumerId, false, true);
    }
    this.location = this.servicesModels && this.servicesModels[0].serviceConsumer ? this.servicesModels[0].serviceConsumer.location : '';

    if (this.servicesModels && this.servicesModels[0]) {
      const serviceModel = this.servicesModels[0]
      if (serviceModel.serviceProvider) {
        this.serviceProviderPic = serviceModel.serviceProvider.imageUrl;
        this.serviceProviderPicType = this.servicesModels[0].serviceProvider.contentContentType;
        if (this.servicesModels[0].serviceConsumer.user) {
          this.serviceConsumerUName = this.servicesModels[0].serviceConsumer.user.firstName
            + ' ' + this.servicesModels[0].serviceConsumer.user.lastName;
        }
      }
      if (serviceModel.serviceConsumer) {
        this.serviceConsumerPic = this.servicesModels[0].serviceConsumer.content;
        this.serviceConsumerPicType = this.servicesModels[0].serviceConsumer.contentContentType;
        if (this.servicesModels[0].serviceConsumer.user) {
          this.serviceConsumerUName = this.servicesModels[0].serviceConsumer.user.firstName
            + ' ' + this.servicesModels[0].serviceConsumer.user.lastName;
        }
      }
    }


    console.log(this.servicesModels);
  }
}
