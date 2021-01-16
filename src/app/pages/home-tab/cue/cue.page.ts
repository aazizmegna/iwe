import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-cue',
  templateUrl: './cue.page.html',
  styleUrls: ['./cue.page.scss'],
})
export class CuePage {

  constructor(public navController: NavController) {
  }

  openCueRide() {
    this.navController.navigateForward('main/main/home-tab/cue-ride');
  }

}
