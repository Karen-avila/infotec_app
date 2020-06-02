import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { Tab1Page } from './tab1.page';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorModule } from '@components/input-error/input-error.module';
import { HeaderModule } from '@components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab1PageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    InputErrorModule,
    HeaderModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
