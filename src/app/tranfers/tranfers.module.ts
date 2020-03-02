import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranfersPageRoutingModule } from './tranfers-routing.module';

import { TranfersPage } from './tranfers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranfersPageRoutingModule
  ],
  declarations: [TranfersPage]
})
export class TranfersPageModule {}
