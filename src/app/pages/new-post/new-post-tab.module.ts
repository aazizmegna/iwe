import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {NewPostTabRoutingModule} from './new-post-tab-routing.module';

import {NewPostTabPage} from './new-post-tab.page';
import {RouterModule, Routes} from '@angular/router';
import {PicturePostPage} from './picture-post';
import {UserRouteAccessService} from '../../services/auth/user-route-access.service';
import {TranslateModule} from '@ngx-translate/core';
import {Camera} from '@ionic-native/camera/ngx';
import {IweMobileSharedModule} from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: NewPostTabPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
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
