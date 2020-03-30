import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayCodiPageRoutingModule } from './pay-codi-routing.module';

import { PayCodiPage } from './pay-codi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayCodiPageRoutingModule
  ],
  declarations: [PayCodiPage]
})
export class PayCodiPageModule {}
