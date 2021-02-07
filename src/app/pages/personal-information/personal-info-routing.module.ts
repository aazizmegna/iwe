import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalInfoPage } from './personal-info.page';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {Camera} from '@ionic-native/camera/ngx';

const routes: Routes = [
  {
    path: '',
    component: PersonalInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule, FormsModule, ReactiveFormsModule,
    CommonModule, TranslateModule],
  exports: [RouterModule],
  declarations: [PersonalInfoPage],
  providers: [Camera],
})
export class PersonalInfoRoutingModule {}
