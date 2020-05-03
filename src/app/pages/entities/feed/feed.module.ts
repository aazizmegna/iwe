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

import { FeedPage } from './feed';
import { FeedUpdatePage } from './feed-update';
import { Feed, FeedService, FeedDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class FeedResolve implements Resolve<Feed> {
  constructor(private service: FeedService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Feed> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Feed>) => response.ok),
        map((feed: HttpResponse<Feed>) => feed.body)
      );
    }
    return of(new Feed());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FeedPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeedUpdatePage,
    resolve: {
      data: FeedResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeedDetailPage,
    resolve: {
      data: FeedResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeedUpdatePage,
    resolve: {
      data: FeedResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FeedPage, FeedUpdatePage, FeedDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FeedPageModule {}
