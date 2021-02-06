import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { HomePage } from './home.page';
import {IonicImageLoader} from 'ionic-image-loader';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'single',
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./single/single.module').then( m => m.SinglePageModule)
  },
  {
    path: 'booking',
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./booking/booking.module').then( m => m.BookingPageModule)
  },
  {
    path: 'booking-overview',
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./booking-overview/booking-overview.module').then( m => m.BookingOverviewPageModule)
  },
  {
    path: 'booking-confirm',
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./booking-confirm/booking-confirm.module').then( m => m.BookingConfirmPageModule)
  },
  {
    path: 'cue',
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./cue/cue.module').then( m => m.CuePageModule)
  },
  {
    path: 'cue-ride',
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./cue-ride/cue-ride.module').then( m => m.CueRidePageModule)
  },
  {
    path: 'cu-ride-confirm',
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./cu-ride-confirm/cu-ride-confirm.module').then( m => m.CuRideConfirmPageModule)
  }
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, RouterModule.forChild(routes), IonicImageLoader],
  declarations: [HomePage],
})
export class HomePageModule {}
