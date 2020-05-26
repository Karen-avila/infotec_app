import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePhonePageRoutingModule } from './change-phone-routing.module';
import { InputErrorModule } from '@components/input-error/input-error.module';

import { ChangePhonePage } from './change-phone.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ChangePhonePageRoutingModule,
    InputErrorModule,
      TranslateModule
  ],
  declarations: [ChangePhonePage]
})
export class ChangePhonePageModule {}
