import {Injectable, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';


import {BookingPage} from './booking.page';
import {ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {Booking, BookingDetailPage, BookingService} from '../../entities/booking';
import {Observable, of} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {UserRouteAccessService} from '../../../services/auth/user-route-access.service';
import {SearchServicesService} from '../../search-services-tab/search-services.service';
import {SearchServicesModel} from '../../search-services-tab/search-services.model';
import {SingleService} from '../single/single.service';
import {IonicImageLoader} from 'ionic-image-loader';

@Injectable({providedIn: 'root'})
export class BookingResolve implements Resolve<SearchServicesModel[]> {
  constructor(private service: SingleService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SearchServicesModel[]> {
    const serviceProviderId = route.params.id ? route.params.id : null;
    console.log(serviceProviderId)
    if (serviceProviderId) {
      return this.service.query(serviceProviderId).pipe(
        filter((response: HttpResponse<SearchServicesModel[]>) => response.ok),
        map((booking: HttpResponse<SearchServicesModel[]>) => booking.body)
      );
    }
    return of(new Array<SearchServicesModel>());
  }
}

const routes: Routes = [
  {
    path: ':id/view',
    component: BookingPage,
    resolve: {
      data: BookingResolve,
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
        ReactiveFormsModule,
        [RouterModule.forChild(routes)],
        IonicImageLoader
    ],
  declarations: [BookingPage]
})


export class BookingPageModule {
}
