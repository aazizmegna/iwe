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

import { ConnectionPage } from './connection';
import { ConnectionUpdatePage } from './connection-update';
import { Connection, ConnectionService, ConnectionDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ConnectionResolve implements Resolve<Connection> {
  constructor(private service: ConnectionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Connection> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Connection>) => response.ok),
        map((connection: HttpResponse<Connection>) => connection.body)
      );
    }
    return of(new Connection());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ConnectionPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConnectionUpdatePage,
    resolve: {
      data: ConnectionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConnectionDetailPage,
    resolve: {
      data: ConnectionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConnectionUpdatePage,
    resolve: {
      data: ConnectionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ConnectionPage, ConnectionUpdatePage, ConnectionDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ConnectionPageModule {}
