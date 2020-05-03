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

import { RatingPage } from './rating';
import { RatingUpdatePage } from './rating-update';
import { Rating, RatingService, RatingDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class RatingResolve implements Resolve<Rating> {
  constructor(private service: RatingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Rating> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Rating>) => response.ok),
        map((rating: HttpResponse<Rating>) => rating.body)
      );
    }
    return of(new Rating());
  }
}

const routes: Routes = [
  {
    path: '',
    component: RatingPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RatingUpdatePage,
    resolve: {
      data: RatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RatingDetailPage,
    resolve: {
      data: RatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RatingUpdatePage,
    resolve: {
      data: RatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [RatingPage, RatingUpdatePage, RatingDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class RatingPageModule {}
