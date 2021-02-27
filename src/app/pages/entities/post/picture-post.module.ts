import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { PicturePostUpdatePage } from './picture-post-update';
import { PicturePost, PicturePostService, PicturePostDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class PicturePostResolve implements Resolve<PicturePost> {
  constructor(private service: PicturePostService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PicturePost> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PicturePost>) => response.ok),
        map((picturePost: HttpResponse<PicturePost>) => picturePost.body)
      );
    }
    return of(new PicturePost());
  }
}

const routes: Routes = [
  {
    path: 'new',
    component: PicturePostUpdatePage,
    resolve: {
      data: PicturePostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PicturePostDetailPage,
    resolve: {
      data: PicturePostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PicturePostUpdatePage,
    resolve: {
      data: PicturePostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PicturePostUpdatePage, PicturePostDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [Camera],
})
export class PicturePostPageModule {}
