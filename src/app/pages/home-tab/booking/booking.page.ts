import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage {

  constructor(public navController: NavController) {
  }

  openBookingOverview() {
    this.navController.navigateForward('main/main/home-tab/booking-overview');
  }

}
