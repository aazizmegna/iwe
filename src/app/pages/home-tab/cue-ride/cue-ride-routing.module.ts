import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CueRidePage } from './cue-ride.page';

const routes: Routes = [
  {
    path: '',
    component: CueRidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CueRidePageRoutingModule {}
