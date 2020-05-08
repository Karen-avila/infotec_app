import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePinPageRoutingModule } from './change-pin-routing.module';

import { ChangePinPage } from './change-pin.page';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorModule } from '@components/input-error/input-error.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePinPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    InputErrorModule
  ],
  declarations: [ChangePinPage]
})
export class ChangePinPageModule {}
