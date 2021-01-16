import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuePageRoutingModule } from './cue-routing.module';

import { CuePage } from './cue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuePageRoutingModule
  ],
  declarations: [CuePage]
})
export class CuePageModule {}
