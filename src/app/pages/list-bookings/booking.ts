import {Component} from '@angular/core';
import {NavController, ToastController, Platform, IonItemSliding} from '@ionic/angular';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {Booking} from './booking.model';
import {BookingService} from './booking.service';
import {AuthServerProvider} from '../../services/auth/auth-jwt.service';
import {orderBy} from 'lodash';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  bookings: Booking[];
  profilePicture: string;
  bookingWith: string;
  location: string;
  name: string;

  // todo: add pagination

  constructor(
    private navController: NavController,
    private bookingService: BookingService,
    private toastCtrl: ToastController,
    public plt: Platform,
    private authProvider: AuthServerProvider
  ) {
    this.bookings = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    console.log(this.authProvider.user.authorities.includes('ROLE_SERVICE_PROVIDER'))
    if (this.authProvider.user.authorities.includes('ROLE_SERVICE_PROVIDER')) {
      this.bookingService
        .queryByServiceProviderId(this.authProvider.user.serviceProviderId)
        .pipe(
          filter((res: HttpResponse<Booking[]>) => res.ok),
          map((res: HttpResponse<Booking[]>) => res.body)
        )
        .subscribe(
          (response: Booking[]) => {
            this.bookings = orderBy(response, ['dateTime'], ['desc']);
            const filteredBooking = this.bookings.filter((booking) => {
              return booking.serviceConsumer.imageUrl && booking.serviceConsumer.location && booking.serviceConsumer.user &&
                booking.serviceConsumer.user.firstName && booking.serviceConsumer.user.lastName;
            })[0];
            this.profilePicture = filteredBooking.serviceConsumer.imageUrl;
            this.location = filteredBooking.serviceConsumer.location;
            this.name = filteredBooking.serviceConsumer.user.firstName + ' ' + filteredBooking.serviceConsumer.user.lastName;

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
      this.bookingService
        .queryByServiceConsumerId(this.authProvider.user.serviceConsumerId)
        .pipe(
          filter((res: HttpResponse<Booking[]>) => res.ok),
          map((res: HttpResponse<Booking[]>) => res.body)
        )
        .subscribe(
          (response: Booking[]) => {
            this.bookings = orderBy(response, ['dateTime'], ['desc'])
            const filteredBooking = this.bookings.filter((booking) => {
              return booking.serviceProvider.imageUrl && booking.serviceProvider.location && booking.serviceProvider.user &&
                booking.serviceProvider.user.firstName && booking.serviceProvider.user.lastName;
            })[0];
            this.profilePicture = filteredBooking.serviceProvider.imageUrl;
            this.location = filteredBooking.serviceProvider.location;
            this.name = filteredBooking.serviceProvider.user.firstName + ' ' + filteredBooking.serviceProvider.user.lastName;

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
