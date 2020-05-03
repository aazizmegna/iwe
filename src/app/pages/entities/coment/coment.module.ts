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

import { ComentPage } from './coment';
import { ComentUpdatePage } from './coment-update';
import { Coment, ComentService, ComentDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ComentResolve implements Resolve<Coment> {
  constructor(private service: ComentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Coment> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Coment>) => response.ok),
        map((coment: HttpResponse<Coment>) => coment.body)
      );
    }
    return of(new Coment());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ComentPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ComentUpdatePage,
    resolve: {
      data: ComentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ComentDetailPage,
    resolve: {
      data: ComentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ComentUpdatePage,
    resolve: {
      data: ComentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ComentPage, ComentUpdatePage, ComentDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ComentPageModule {}
