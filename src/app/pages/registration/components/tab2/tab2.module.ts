import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab2PageRoutingModule } from './tab2-routing.module';

import { Tab2Page } from './tab2.page';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorModule } from '@components/input-error/input-error.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from '@components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab2PageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    InputErrorModule,
    HttpClientModule,
    HeaderModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}