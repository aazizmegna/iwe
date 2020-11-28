import { Component, OnInit } from '@angular/core';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-booking-detail',
  templateUrl: 'booking-detail.html',
})
export class BookingDetailPage implements OnInit {
  booking: Booking = {};

  constructor(
    private navController: NavController,
    private bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.booking = response.data;
    });
  }

  open(item: Booking) {
    this.navController.navigateForward('/tabs/entities/booking/' + item.id + '/edit');
  }

  async deleteModal(item: Booking) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.bookingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/booking');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
