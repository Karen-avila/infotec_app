import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab2PageRoutingModule } from './tab2-routing.module';

import { Tab2Page } from './tab2.page';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorModule } from '@components/input-error/input-error.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab2PageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    InputErrorModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
