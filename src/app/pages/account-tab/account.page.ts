import {Component, OnInit} from '@angular/core';
import {SingleService} from '../home-tab/single/single.service';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {SearchServicesModel} from '../search-services-tab/search-services.model';
import {AuthServerProvider} from '../../services/auth/auth-jwt.service';
import {HomeService} from '../home-tab/home.service';
import {BaseEntity} from '../../../model/base-entity';
import {ServiceProvider, ServiceProviderService} from '../entities/service-provider';
import {ServiceConsumer, ServiceConsumerService} from '../entities/service-consumer';
import {Home} from '../home-tab/home.model';
import {LocalStorageService} from 'ngx-webstorage';

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
  private provider;
  private consumer;


  constructor(private service: SingleService, private authProvider: AuthServerProvider, private homeService: HomeService,
              private serviceProviderService: ServiceProviderService, private $localstorage: LocalStorageService,
              private serviceConsumerService: ServiceConsumerService) {
  }

  ngOnInit(): void {
  }

  ionViewWillEnter() {
    this.loadUserServices();
  }

  async loadUserServices() {
    // tslint:disable-next-line:max-line-length
    this.provider = await this.serviceProviderService.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    this.consumer = await this.serviceConsumerService.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    let userId;
    if (this.consumer.body && !this.provider.body) {
      userId = this.consumer.body.id;
    } else if (!this.consumer.body && this.provider.body) {
      userId = this.provider.body.id;
    }
    this.servicesModels = await this.homeService.loadAllFreemiumPostsWithBusinessUsersPosts(userId, false);

    if (this.servicesModels && this.servicesModels[0]) {
      const serviceModel = this.servicesModels[0];
      if (serviceModel.serviceProvider) {
        this.serviceProviderPic = serviceModel.serviceProvider.user.imageUrl;
        this.serviceProviderPicType = this.servicesModels[0].serviceProvider.contentContentType;
        this.serviceConsumerUName = serviceModel.serviceProvider.user.firstName
          + ' ' + serviceModel.serviceProvider.user.lastName;
        this.location = serviceModel.serviceProvider.user.location;
      }
      if (serviceModel.serviceConsumer) {
        this.serviceConsumerPic = this.servicesModels[0].serviceConsumer.user.imageUrl;
        this.serviceConsumerPicType = this.servicesModels[0].serviceConsumer.contentContentType;
        if (this.servicesModels[0].serviceConsumer.user) {
          this.serviceConsumerUName = this.servicesModels[0].serviceConsumer.user.firstName
            + ' ' + this.servicesModels[0].serviceConsumer.user.lastName;
        }
        this.location = serviceModel.serviceConsumer.user.location;

      }
    }


    console.log(this.servicesModels);
  }
}
