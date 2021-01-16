import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingOverviewPage } from './booking-overview.page';

const routes: Routes = [
  {
    path: '',
    component: BookingOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingOverviewPageRoutingModule {}
