import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {Booking} from '../../entities/booking';
import {SearchServicesModel} from '../../search-services-tab/search-services.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-single',
  templateUrl: './single.page.html',
  styleUrls: ['./single.page.scss'],
})
export class SinglePage implements OnInit {
  searchServicesModels: SearchServicesModel[];

  constructor(public navController: NavController, private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.searchServicesModels = response.data;
    });
  }

  openBooking(searchServicesModel: SearchServicesModel) {
    this.navController.navigateForward('tabs/home/booking/' + searchServicesModel.id.toString() + '/view');
  }

  view(booking: Booking) {
    this.navController.navigateForward('/tabs/entities/booking/' + booking.id + '/view');
  }

  openCue() {
    this.navController.navigateForward('tabs/home/cue');
  }

}
