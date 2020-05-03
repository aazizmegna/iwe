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

import { ServiceProviderPage } from './service-provider';
import { ServiceProviderUpdatePage } from './service-provider-update';
import { ServiceProvider, ServiceProviderService, ServiceProviderDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ServiceProviderResolve implements Resolve<ServiceProvider> {
  constructor(private service: ServiceProviderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ServiceProvider> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ServiceProvider>) => response.ok),
        map((serviceProvider: HttpResponse<ServiceProvider>) => serviceProvider.body)
      );
    }
    return of(new ServiceProvider());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ServiceProviderPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceProviderUpdatePage,
    resolve: {
      data: ServiceProviderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceProviderDetailPage,
    resolve: {
      data: ServiceProviderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceProviderUpdatePage,
    resolve: {
      data: ServiceProviderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ServiceProviderPage, ServiceProviderUpdatePage, ServiceProviderDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ServiceProviderPageModule {}
