import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecondLoginPageRoutingModule } from './second-login-routing.module';

import { SecondLoginPage } from './second-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecondLoginPageRoutingModule
  ],
  declarations: [SecondLoginPage]
})
export class SecondLoginPageModule {}
