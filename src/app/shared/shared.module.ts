import { NgModule } from '@angular/core';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import {IonicImageLoader} from 'ionic-image-loader';

@NgModule({
  declarations: [HasAnyAuthorityDirective],
  exports: [
    HasAnyAuthorityDirective,
    IonicImageLoader
  ],
})
export class IweMobileSharedModule {}
