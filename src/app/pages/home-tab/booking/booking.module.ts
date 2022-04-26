import {Injectable, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {BookingPage} from './booking.page';
import {ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {Observable, of} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {UserRouteAccessService} from '../../../services/auth/user-route-access.service';
import {SearchServicesModel} from '../../search-services-tab/search-services.model';
import {IonicImageLoader} from 'ionic-image-loader';
import {Service, ServiceService} from '../../entities/service';

@Injectable({providedIn: 'root'})
export class BookingResolve implements Resolve<Service> {
  constructor(private service: ServiceService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Service> {
    const serviceId = route.params.id ? route.params.id : null;
    console.log(serviceId);
    if (serviceId) {
      return this.service.find(serviceId).pipe(
        filter((response: HttpResponse<Service>) => response.ok),
        map((booking: HttpResponse<Service>) => booking.body)
      );
    }
    return of(new Service());
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
