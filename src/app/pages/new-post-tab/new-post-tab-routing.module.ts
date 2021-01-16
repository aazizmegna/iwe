import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPostTabPage } from './new-post-tab.page';

const routes: Routes = [
  {
    path: '',
    component: NewPostTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPostTabRoutingModule {}
