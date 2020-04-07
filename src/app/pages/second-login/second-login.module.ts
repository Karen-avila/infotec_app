import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecondLoginPageRoutingModule } from './second-login-routing.module';

import { SecondLoginPage } from './second-login.page';
import { InputErrorModule } from '@components/input-error/input-error.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecondLoginPageRoutingModule,
    ReactiveFormsModule,
    InputErrorModule,
    TranslateModule
  ],
  declarations: [SecondLoginPage]
})
export class SecondLoginPageModule {}
