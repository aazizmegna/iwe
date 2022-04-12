import {Injectable, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SinglePage} from './single.page';
import {ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {SearchServicesModel} from '../../search-services-tab/search-services.model';
import {Observable, of} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {UserRouteAccessService} from '../../../services/auth/user-route-access.service';
import {SingleService} from './single.service';
import {IonicImageLoader} from 'ionic-image-loader';

@Injectable({providedIn: 'root'})
export class SingleResolve implements Resolve<SearchServicesModel[]> {
  constructor(private service: SingleService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SearchServicesModel[]> {
    const serviceProviderId = route.params.id ? route.params.id : null;
    if (serviceProviderId) {
      const res = this.service.query(serviceProviderId).pipe(
        filter((response: HttpResponse<SearchServicesModel[]>) => response.ok),
        map((searchModel: HttpResponse<SearchServicesModel[]>) => {
          console.log(searchModel.body);
          return searchModel.body;
        })
      );
      return res;
    }
    return of(new Array<SearchServicesModel>());
  }
}

const routes: Routes = [
  {
    path: ':id/view',
    component: SinglePage,
    resolve: {
      data: SingleResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    [RouterModule.forChild(routes), IonicImageLoader]
  ],
  declarations: [SinglePage]
})
export class SinglePageModule {
}
