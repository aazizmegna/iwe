import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuRideConfirmPageRoutingModule } from './cu-ride-confirm-routing.module';

import { CuRideConfirmPage } from './cu-ride-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuRideConfirmPageRoutingModule
  ],
  declarations: [CuRideConfirmPage]
})
export class CuRideConfirmPageModule {}
