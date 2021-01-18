import { Component, OnInit } from '@angular/core';
import {BookingProvider} from '../booking/booking.provider';
import {AuthServerProvider} from '../../../services/auth/auth-jwt.service';

@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.page.html',
  styleUrls: ['./booking-confirm.page.scss'],
})
export class BookingConfirmPage implements OnInit {

  constructor(public bookingProvider: BookingProvider, public authProvider: AuthServerProvider) { }

  ngOnInit() {
  }

}
