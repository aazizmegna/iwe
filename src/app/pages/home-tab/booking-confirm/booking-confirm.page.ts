import { Component, OnInit } from '@angular/core';
import {BookingProvider} from '../booking/booking.provider';
import {AuthServerProvider} from '../../../services/auth/auth-jwt.service';
import {WonderPush} from '@awesome-cordova-plugins/wonderpush/ngx';

@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.page.html',
  styleUrls: ['./booking-confirm.page.scss'],
})
export class BookingConfirmPage implements OnInit {

  constructor(public bookingProvider: BookingProvider, public authProvider: AuthServerProvider,
              private wonderPush: WonderPush) { }

  ngOnInit() {
  }

}
