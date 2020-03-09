import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranfersPageRoutingModule } from './transfers-routing.module';

import { TransfersPage } from './transfers.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TranfersPageRoutingModule
  ],
  declarations: [TransfersPage]
})
export class TransfersPageModule {}
