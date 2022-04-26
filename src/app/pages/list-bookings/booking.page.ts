import {Component, OnInit} from '@angular/core';
import {NavController, ToastController, Platform, IonItemSliding, LoadingController} from '@ionic/angular';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {Booking} from './booking.model';
import {BookingService} from './booking.service';
import {AuthServerProvider} from '../../services/auth/auth-jwt.service';
import {orderBy} from 'lodash';
import {ServiceProvider, ServiceProviderService} from '../entities/service-provider';
import {LocalStorageService} from 'ngx-webstorage';
import {ServiceConsumerService} from '../entities/service-consumer';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
  styleUrls: ['booking.page.scss'],
})
export class BookingPage implements OnInit {
  bookings: Booking[];
  profilePicture: string;
  bookingWith: string;
  location: string;
  name: string;
  consumer;
  provider;
  isConsumer: boolean;
  isLoading = false;
  loading;

  // todo: add pagination

  constructor(
    private navController: NavController,
    private bookingService: BookingService,
    private toastCtrl: ToastController,
    public plt: Platform,
    private authProvider: AuthServerProvider,
    private serviceProvider: ServiceProviderService,
    private serviceConsumer: ServiceConsumerService,
    private $localstorage: LocalStorageService,
    public loadingController: LoadingController
  ) {
    this.bookings = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }

  async presentLoading() {
    if (this.isLoading) {
      await this.loading.present();
    }
    if (!this.isLoading) {
      await this.loading.dismiss();
    }
  }

  async loadAll(refresher?) {
    this.provider = await this.serviceProvider.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    if (this.provider.body) {
      this.isConsumer = false;
      this.isLoading = true;
      await this.presentLoading();
      this.bookingService
        .queryByServiceProviderId(this.provider.body.id)
        .pipe(
          filter((res: HttpResponse<Booking[]>) => res.ok),
          map((res: HttpResponse<Booking[]>) => {
            this.isLoading = true;
            this.presentLoading();
            return res.body;
          })
        )
        .subscribe(
          (response: Booking[]) => {
            this.bookings = orderBy(response, ['dateTime'], ['desc']);
            if (typeof refresher !== 'undefined') {
              setTimeout(() => {
                refresher.target.complete();
              }, 750);
            }
          },
          async (error) => {
            console.error(error);
            const toast = await this.toastCtrl.create({
              message: 'Failed to load data',
              duration: 2000,
              position: 'middle'
            });
            toast.present();
          }
        );

      this.isLoading = false;
      await this.presentLoading();
    } else {
      this.consumer = await this.serviceConsumer.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
      this.isConsumer = true;

      this.bookingService
        .queryByServiceConsumerId(this.consumer.body.id)
        .pipe(
          filter((res: HttpResponse<Booking[]>) => res.ok),
          map((res: HttpResponse<Booking[]>) => {

            return res.body;
          })
        )
        .subscribe(
          (response: Booking[]) => {
            this.isLoading = true;
            this.presentLoading();
            this.bookings = orderBy(response, ['dateTime'], ['desc']);
            this.isLoading = false;
            this.presentLoading();
            if (typeof refresher !== 'undefined') {
              setTimeout(() => {
                refresher.target.complete();
              }, 750);
            }
          },
          async (error) => {
            console.error(error);
            const toast = await this.toastCtrl.create({
              message: 'Failed to load data',
              duration: 2000,
              position: 'middle'
            });
            toast.present();
          }
        );

    }
  }

  trackId(index: number, item: Booking) {
    return item.id;
  }
}
