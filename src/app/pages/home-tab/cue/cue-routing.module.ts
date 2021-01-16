import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuePage } from './cue.page';

const routes: Routes = [
  {
    path: '',
    component: CuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuePageRoutingModule {}
