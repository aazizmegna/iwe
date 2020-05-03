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

import { ServiceConsumerPage } from './service-consumer';
import { ServiceConsumerUpdatePage } from './service-consumer-update';
import { ServiceConsumer, ServiceConsumerService, ServiceConsumerDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ServiceConsumerResolve implements Resolve<ServiceConsumer> {
  constructor(private service: ServiceConsumerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ServiceConsumer> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ServiceConsumer>) => response.ok),
        map((serviceConsumer: HttpResponse<ServiceConsumer>) => serviceConsumer.body)
      );
    }
    return of(new ServiceConsumer());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ServiceConsumerPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceConsumerUpdatePage,
    resolve: {
      data: ServiceConsumerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceConsumerDetailPage,
    resolve: {
      data: ServiceConsumerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceConsumerUpdatePage,
    resolve: {
      data: ServiceConsumerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ServiceConsumerPage, ServiceConsumerUpdatePage, ServiceConsumerDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ServiceConsumerPageModule {}
