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

import { PostUpdatePage } from './post-update';
import { Post, PostService, PostDetailPage } from '.';
import { Camera } from '@ionic-native/camera/ngx';

@Injectable({ providedIn: 'root' })
export class PostResolve implements Resolve<Post> {
  constructor(private service: PostService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Post>) => response.ok),
        map((post: HttpResponse<Post>) => post.body)
      );
    }
    return of(new Post());
  }
}

const routes: Routes = [
  {
    path: 'new',
    component: PostUpdatePage,
    resolve: {
      data: PostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PostDetailPage,
    resolve: {
      data: PostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PostUpdatePage,
    resolve: {
      data: PostResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PostUpdatePage, PostDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [Camera],
})
export class PostPageModule {}
