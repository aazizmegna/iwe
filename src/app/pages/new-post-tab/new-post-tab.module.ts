import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {NewPostTabPage} from './new-post-tab.page';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../services/auth/user-route-access.service';
import {TranslateModule} from '@ngx-translate/core';
import {Camera} from '@ionic-native/camera/ngx';
import {IweMobileSharedModule} from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: NewPostTabPage,
  }
];

@NgModule({
  declarations: [NewPostTabPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule,
    RouterModule.forChild(routes), IweMobileSharedModule],
  providers: [Camera],
})
export class NewPostTabModule {
}
