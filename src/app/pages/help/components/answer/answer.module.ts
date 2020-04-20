import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnswerPageRoutingModule } from './answer-routing.module';

import { AnswerPage } from './answer.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnswerPageRoutingModule,
    TranslateModule
  ],
  declarations: [AnswerPage]
})
export class AnswerPageModule {}
