import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { ChatPage } from './chat.page';
import {Observable, of} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {UserRouteAccessService} from '../../../services/auth/user-route-access.service';
import {ChatService} from './chat.service';
import {ServiceProvider} from '../../entities/service-provider';

@Injectable({providedIn: 'root'})
export class ChatResolve implements Resolve<ServiceProvider> {
  constructor(private service: ChatService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ServiceProvider> {
    const serviceProviderId = route.params.id ? route.params.id : null;
    if (serviceProviderId) {
      return this.service.find(serviceProviderId).pipe(
        filter((response: HttpResponse<ServiceProvider>) => response.ok),
        map((booking: HttpResponse<ServiceProvider>) => booking.body)
      );
    }
    return of(new ServiceProvider());
  }
}

const routes: Routes = [
  {
    path: ':id',
    component: ChatPage,
    resolve: {
      data: ChatResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
