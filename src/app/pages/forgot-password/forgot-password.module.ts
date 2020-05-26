import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';
import { SvgModule } from '@components/svg/svg.module';
import { ForgotPasswordPage } from './forgot-password.page';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorModule } from '@components/input-error/input-error.module';
import { FooterModule } from '@components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    TranslateModule,
    InputErrorModule,
    SvgModule,
    FooterModule
  ],
  declarations: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {}
