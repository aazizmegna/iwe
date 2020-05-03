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

import { VideoPostPage } from './video-post';
import { VideoPostUpdatePage } from './video-post-update';
import { VideoPost, VideoPostService, VideoPostDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class VideoPostResolve implements Resolve<VideoPost> {
  constructor(private service: VideoPostService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VideoPost> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<VideoPost>) => response.ok),
        map((videoPost: HttpResponse<VideoPost>) => videoPost.body)
      );
    }
    return of(new VideoPost());
  }
}

const routes: Routes = [
  {
    path: '',
    component: VideoPostPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VideoPostUpdatePage,
    resolve: {
      data: VideoPostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VideoPostDetailPage,
    resolve: {
      data: VideoPostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VideoPostUpdatePage,
    resolve: {
      data: VideoPostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [VideoPostPage, VideoPostUpdatePage, VideoPostDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class VideoPostPageModule {}
