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

import { InvitationPage } from './invitation';
import { InvitationUpdatePage } from './invitation-update';
import { Invitation, InvitationService, InvitationDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class InvitationResolve implements Resolve<Invitation> {
  constructor(private service: InvitationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Invitation> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Invitation>) => response.ok),
        map((invitation: HttpResponse<Invitation>) => invitation.body)
      );
    }
    return of(new Invitation());
  }
}

const routes: Routes = [
  {
    path: '',
    component: InvitationPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InvitationUpdatePage,
    resolve: {
      data: InvitationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InvitationDetailPage,
    resolve: {
      data: InvitationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InvitationUpdatePage,
    resolve: {
      data: InvitationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [InvitationPage, InvitationUpdatePage, InvitationDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class InvitationPageModule {}
