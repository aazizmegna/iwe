import {Component} from '@angular/core';
import {NavController, ToastController, Platform, IonItemSliding} from '@ionic/angular';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {Booking} from './booking.model';
import {BookingService} from './booking.service';
import {AuthServerProvider} from '../../services/auth/auth-jwt.service';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  bookings: Booking[];
  profilePicture: string;
  bookingWith: string;

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
    this.determineWhoisBookingWith();
  }

  async loadAll(refresher?) {
    if (this.authProvider.user.authorities.includes('ROLE_SERVICE_PROVIDER')) {
      this.bookingService
        .queryByServiceProviderId(this.authProvider.user.serviceProviderId)
        .pipe(
          filter((res: HttpResponse<Booking[]>) => res.ok),
          map((res: HttpResponse<Booking[]>) => res.body)
        )
        .subscribe(
          (response: Booking[]) => {
            this.bookings = response;
            this.profilePicture = this.bookings[0].serviceConsumer.imageUrl;

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
            this.bookings = response;
            this.profilePicture = this.bookings[0].serviceProvider.imageUrl;
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

  determineWhoisBookingWith() {
    if (this.authProvider.user.authorities.includes('ROLE_SERVICE_PROVIDER')) {
        this.bookingWith = this.bookings[0].serviceConsumer.user.firstName + ' ' +  this.bookings[0].serviceConsumer.user.lastName;
    } else {
      this.bookingWith = this.bookings[0].serviceProvider.user.firstName + ' ' +  this.bookings[0].serviceProvider.user.lastName;
    }
  }
}
