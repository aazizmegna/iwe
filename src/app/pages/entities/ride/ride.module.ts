import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { RidePage } from './ride';
import { RideUpdatePage } from './ride-update';
import { Ride, RideService, RideDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class RideResolve implements Resolve<Ride> {
  constructor(private service: RideService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Ride> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Ride>) => response.ok),
        map((ride: HttpResponse<Ride>) => ride.body)
      );
    }
    return of(new Ride());
  }
}

const routes: Routes = [
  {
    path: '',
    component: RidePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RideUpdatePage,
    resolve: {
      data: RideResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RideDetailPage,
    resolve: {
      data: RideResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RideUpdatePage,
    resolve: {
      data: RideResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [RidePage, RideUpdatePage, RideDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class RidePageModule {}
