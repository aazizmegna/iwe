import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-single',
  templateUrl: './single.page.html',
  styleUrls: ['./single.page.scss'],
})
export class SinglePage {
  
  constructor(public navController: NavController) {
  }
  
  openBooking() {
    this.navController.navigateForward('main/main/home-tab/booking');
  }

  openCue() {
    this.navController.navigateForward('main/main/home-tab/cue');
  }
  
}
