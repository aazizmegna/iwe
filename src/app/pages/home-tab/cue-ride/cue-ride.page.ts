import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-cue-ride',
  templateUrl: './cue-ride.page.html',
  styleUrls: ['./cue-ride.page.scss'],
})
export class CueRidePage {

  constructor(public navController: NavController) {
  }
  
  openCueRideConfirm() {
    this.navController.navigateForward('main/main/home-tab/cu-ride-confirm');
  }
  
}
