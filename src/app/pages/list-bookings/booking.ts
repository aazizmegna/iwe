import {Component} from '@angular/core';
import {NavController, ToastController, Platform, IonItemSliding} from '@ionic/angular';
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
export class BookingPage {
  bookings: Booking[];
  profilePicture: string;
  bookingWith: string;
  location: string;
  name: string;
  consumer;
  provider;

  // todo: add pagination

  constructor(
    private navController: NavController,
    private bookingService: BookingService,
    private toastCtrl: ToastController,
    public plt: Platform,
    private authProvider: AuthServerProvider,
    private serviceProvider: ServiceProviderService,
    private serviceConsumer: ServiceConsumerService,
    private $localstorage: LocalStorageService
  ) {
    this.bookings = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.provider = await this.serviceProvider.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();
    if (this.provider.body) {
      this.bookingService
        .queryByServiceProviderId(this.provider.body.id)
        .pipe(
          filter((res: HttpResponse<Booking[]>) => res.ok),
          map((res: HttpResponse<Booking[]>) => res.body)
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
            const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
            toast.present();
          }
        );
    } else {
      this.consumer = await this.serviceConsumer.findByUserEmail(this.$localstorage.retrieve('email')).toPromise();

      this.bookingService
        .queryByServiceConsumerId(this.consumer.body.id)
        .pipe(
          filter((res: HttpResponse<Booking[]>) => res.ok),
          map((res: HttpResponse<Booking[]>) => res.body)
        )
        .subscribe(
          (response: Booking[]) => {
            this.bookings = orderBy(response, ['dateTime'], ['desc'])
            if (typeof refresher !== 'undefined') {
              setTimeout(() => {
                refresher.target.complete();
              }, 750);
            }
          },
          async (error) => {
            console.error(error);
            const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
            toast.present();
          }
        );
    }
  }

  trackId(index: number, item: Booking) {
    return item.id;
  }
}
