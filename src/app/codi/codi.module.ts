import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodiPageRoutingModule } from './codi-routing.module';

import { CodiPage } from './codi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodiPageRoutingModule
  ],
  declarations: [CodiPage]
})
export class CodiPageModule {}
