import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePhonePageRoutingModule } from './change-phone-routing.module';

import { ChangePhonePage } from './change-phone.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePhonePageRoutingModule
  ],
  declarations: [ChangePhonePage]
})
export class ChangePhonePageModule {}
