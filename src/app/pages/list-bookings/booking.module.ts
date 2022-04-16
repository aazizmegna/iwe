import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BookingPage } from './booking.page';
import {UserRouteAccessService} from '../../services/auth/user-route-access.service';
import {IonicImageLoader} from 'ionic-image-loader';
import {IweMobileSharedModule} from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: BookingPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [BookingPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes), IonicImageLoader, IweMobileSharedModule],
})
export class BookingPageModule {}
