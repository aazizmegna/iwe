import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  bookings: Booking[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private bookingService: BookingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.bookings = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.bookingService
      .query()
      .pipe(
        filter((res: HttpResponse<Booking[]>) => res.ok),
        map((res: HttpResponse<Booking[]>) => res.body)
      )
      .subscribe(
        (response: Booking[]) => {
          this.bookings = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: Booking) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/booking/new');
  }

  edit(item: IonItemSliding, booking: Booking) {
    this.navController.navigateForward('/tabs/entities/booking/' + booking.id + '/edit');
    item.close();
  }

  async delete(booking) {
    this.bookingService.delete(booking.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Booking deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(booking: Booking) {
    this.navController.navigateForward('/tabs/entities/booking/' + booking.id + '/view');
  }
}
