import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePhonePageRoutingModule } from './change-phone-routing.module';

import { ChangePhonePage } from './change-phone.page';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorModule } from '@components/input-error/input-error.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePhonePageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    InputErrorModule
  ],
  declarations: [ChangePhonePage]
})
export class ChangePhonePageModule {}
