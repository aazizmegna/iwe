import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CueRidePageRoutingModule } from './cue-ride-routing.module';

import { CueRidePage } from './cue-ride.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CueRidePageRoutingModule
  ],
  declarations: [CueRidePage]
})
export class CueRidePageModule {}
