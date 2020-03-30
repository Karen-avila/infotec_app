import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectCodiPageRoutingModule } from './collect-codi-routing.module';

import { CollectCodiPage } from './collect-codi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectCodiPageRoutingModule
  ],
  declarations: [CollectCodiPage]
})
export class CollectCodiPageModule {}
