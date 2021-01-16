import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuRideConfirmPage } from './cu-ride-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: CuRideConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuRideConfirmPageRoutingModule {}
