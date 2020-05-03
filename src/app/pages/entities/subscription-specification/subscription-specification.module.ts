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

import { SubscriptionSpecificationPage } from './subscription-specification';
import { SubscriptionSpecificationUpdatePage } from './subscription-specification-update';
import { SubscriptionSpecification, SubscriptionSpecificationService, SubscriptionSpecificationDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class SubscriptionSpecificationResolve implements Resolve<SubscriptionSpecification> {
  constructor(private service: SubscriptionSpecificationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SubscriptionSpecification> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<SubscriptionSpecification>) => response.ok),
        map((subscriptionSpecification: HttpResponse<SubscriptionSpecification>) => subscriptionSpecification.body)
      );
    }
    return of(new SubscriptionSpecification());
  }
}

const routes: Routes = [
  {
    path: '',
    component: SubscriptionSpecificationPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SubscriptionSpecificationUpdatePage,
    resolve: {
      data: SubscriptionSpecificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SubscriptionSpecificationDetailPage,
    resolve: {
      data: SubscriptionSpecificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SubscriptionSpecificationUpdatePage,
    resolve: {
      data: SubscriptionSpecificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [SubscriptionSpecificationPage, SubscriptionSpecificationUpdatePage, SubscriptionSpecificationDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class SubscriptionSpecificationPageModule {}
