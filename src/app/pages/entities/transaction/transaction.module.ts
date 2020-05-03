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

import { TransactionPage } from './transaction';
import { TransactionUpdatePage } from './transaction-update';
import { Transaction, TransactionService, TransactionDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class TransactionResolve implements Resolve<Transaction> {
  constructor(private service: TransactionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Transaction> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Transaction>) => response.ok),
        map((transaction: HttpResponse<Transaction>) => transaction.body)
      );
    }
    return of(new Transaction());
  }
}

const routes: Routes = [
  {
    path: '',
    component: TransactionPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TransactionUpdatePage,
    resolve: {
      data: TransactionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TransactionDetailPage,
    resolve: {
      data: TransactionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TransactionUpdatePage,
    resolve: {
      data: TransactionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [TransactionPage, TransactionUpdatePage, TransactionDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class TransactionPageModule {}
