import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingOverviewPageRoutingModule } from './booking-overview-routing.module';

import { BookingOverviewPage } from './booking-overview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingOverviewPageRoutingModule
  ],
  declarations: [BookingOverviewPage]
})
export class BookingOverviewPageModule {}
