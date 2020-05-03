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

import { LocationServiceProviderPage } from './location-service-provider';
import { LocationServiceProviderUpdatePage } from './location-service-provider-update';
import { LocationServiceProvider, LocationServiceProviderService, LocationServiceProviderDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class LocationServiceProviderResolve implements Resolve<LocationServiceProvider> {
  constructor(private service: LocationServiceProviderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LocationServiceProvider> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<LocationServiceProvider>) => response.ok),
        map((locationServiceProvider: HttpResponse<LocationServiceProvider>) => locationServiceProvider.body)
      );
    }
    return of(new LocationServiceProvider());
  }
}

const routes: Routes = [
  {
    path: '',
    component: LocationServiceProviderPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LocationServiceProviderUpdatePage,
    resolve: {
      data: LocationServiceProviderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LocationServiceProviderDetailPage,
    resolve: {
      data: LocationServiceProviderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LocationServiceProviderUpdatePage,
    resolve: {
      data: LocationServiceProviderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [LocationServiceProviderPage, LocationServiceProviderUpdatePage, LocationServiceProviderDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class LocationServiceProviderPageModule {}
