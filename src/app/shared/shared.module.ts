import { NgModule } from '@angular/core';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';

@NgModule({
  declarations: [HasAnyAuthorityDirective],
  exports: [
    HasAnyAuthorityDirective,
  ],
})
export class IweMobileSharedModule {}
