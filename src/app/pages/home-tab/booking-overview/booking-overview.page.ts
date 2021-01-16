import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.page.html',
  styleUrls: ['./booking-overview.page.scss'],
})
export class BookingOverviewPage {

  constructor(public navController: NavController) {
  }

  openBookingConfirm() {
    this.navController.navigateForward('main/main/home-tab/booking-confirm');
  }

}
