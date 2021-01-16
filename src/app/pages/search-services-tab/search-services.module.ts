import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SearchServicesRoutingModule} from './search-services-routing.module';

import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../services/auth/user-route-access.service';
import {TranslateModule} from '@ngx-translate/core';
import {Camera} from '@ionic-native/camera/ngx';
import {IweMobileSharedModule} from '../../shared/shared.module';
import {SearchServicesPage} from './search-services.page';

const routes: Routes = [
  {
    path: '',
    component: SearchServicesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  }
];

@NgModule({
  declarations: [SearchServicesPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule,
    RouterModule.forChild(routes), IweMobileSharedModule],
  providers: [Camera],
})
export class SearchServicesModule {
}
