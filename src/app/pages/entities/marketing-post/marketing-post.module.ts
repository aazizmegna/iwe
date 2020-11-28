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

import { MarketingPostPage } from './marketing-post';
import { MarketingPostUpdatePage } from './marketing-post-update';
import { MarketingPost, MarketingPostService, MarketingPostDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class MarketingPostResolve implements Resolve<MarketingPost> {
  constructor(private service: MarketingPostService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MarketingPost> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<MarketingPost>) => response.ok),
        map((marketingPost: HttpResponse<MarketingPost>) => marketingPost.body)
      );
    }
    return of(new MarketingPost());
  }
}

const routes: Routes = [
  {
    path: '',
    component: MarketingPostPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MarketingPostUpdatePage,
    resolve: {
      data: MarketingPostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MarketingPostDetailPage,
    resolve: {
      data: MarketingPostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MarketingPostUpdatePage,
    resolve: {
      data: MarketingPostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [MarketingPostPage, MarketingPostUpdatePage, MarketingPostDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class MarketingPostPageModule {}
