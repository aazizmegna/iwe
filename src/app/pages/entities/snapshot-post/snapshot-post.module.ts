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

import { SnapshotPostPage } from './snapshot-post';
import { SnapshotPostUpdatePage } from './snapshot-post-update';
import { SnapshotPost, SnapshotPostService, SnapshotPostDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class SnapshotPostResolve implements Resolve<SnapshotPost> {
  constructor(private service: SnapshotPostService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SnapshotPost> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<SnapshotPost>) => response.ok),
        map((snapshotPost: HttpResponse<SnapshotPost>) => snapshotPost.body)
      );
    }
    return of(new SnapshotPost());
  }
}

const routes: Routes = [
  {
    path: '',
    component: SnapshotPostPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SnapshotPostUpdatePage,
    resolve: {
      data: SnapshotPostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SnapshotPostDetailPage,
    resolve: {
      data: SnapshotPostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SnapshotPostUpdatePage,
    resolve: {
      data: SnapshotPostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [SnapshotPostPage, SnapshotPostUpdatePage, SnapshotPostDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class SnapshotPostPageModule {}
