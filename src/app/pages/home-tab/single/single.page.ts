import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Booking} from '../../entities/booking';
import {SearchServicesModel} from '../../search-services-tab/search-services.model';
import {ActivatedRoute} from '@angular/router';
import {AuthServerProvider} from '../../../services/auth/auth-jwt.service';
import {BookingProvider} from '../booking/booking.provider';

@Component({
  selector: 'app-single',
  templateUrl: './single.page.html',
  styleUrls: ['./single.page.scss'],
})
export class SinglePage implements OnInit {
  searchServicesModels: SearchServicesModel[];
  lastIndexName = 20;
  lastIndexLocation = 100;
  counterLocation = 100;
  counterName = 20;
  firstCount = 20;
  location;
  showTxt = 'Show More';

  constructor(public navController: NavController, private activatedRoute: ActivatedRoute, private bookingProvider: BookingProvider
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.searchServicesModels = response.data;
      this.searchServicesModels.forEach((service) => {
        this.lastIndexName = (service.name.substring(0, 20)).lastIndexOf('');
        this.lastIndexLocation = (service.location.substring(0, 20)).lastIndexOf('');
        if (this.lastIndexName > 20) {
          this.lastIndexName = 20;
        }
        if (this.lastIndexLocation > 20) {
          this.lastIndexLocation = 20;
        }
        this.counterLocation = this.lastIndexLocation;
        this.counterName = this.lastIndexName;
      });
    });
  }

  toggleNameLength($event: MouseEvent, service: SearchServicesModel) {
    if (this.counterName < 21) {

        this.counterName = service.name.length;
        this.showTxt = 'Show less';

      } else {
        this.counterName = this.lastIndexName;

        this.showTxt = 'Show More';
      }
  }

  toggleLocationLength($event: MouseEvent, service: SearchServicesModel) {
    if (this.counterLocation < 21) {
        this.counterLocation = service.location.length;
        this.showTxt = 'Show less';
      } else {
        this.counterLocation = this.lastIndexLocation;
        this.showTxt = 'Show More';
      }
  }

  openBooking(serviceId: number) {
    console.log(serviceId);
    this.navController.navigateForward('tabs/home/booking/' + serviceId.toString() + '/view');
  }

  view(booking: Booking) {
    this.navController.navigateForward('/tabs/entities/booking/' + booking.id + '/view');
  }

  openCue() {
    this.navController.navigateForward('tabs/home/cue');
  }

}
