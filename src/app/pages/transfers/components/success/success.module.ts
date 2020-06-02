import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { TranslateModule } from '@ngx-translate/core';
import { InputErrorModule } from '@components/input-error/input-error.module';
import { HeaderModule } from '@components/header/header.module';
import { FooterModule } from '@components/footer/footer.module';
import { SuccessComponent } from './success.page';
import { SuccessPageRoutingModule } from './success-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    InputErrorModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [SuccessComponent],
  entryComponents: [SuccessComponent]
})
export class SuccessPageModule {}
