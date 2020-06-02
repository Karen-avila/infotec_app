import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranfersPageRoutingModule } from './transfers-routing.module';

import { TransfersPage } from './transfers.page';
import { TranslateModule } from '@ngx-translate/core';
import { CardAccountModule } from '@components/card-account/card-account.module';
import { ManageAccountPageModule } from './components/manage-account/manage-account.module';
import { HeaderModule } from '@components/header/header.module';
import { FooterModule } from '@components/footer/footer.module';
import { InputErrorModule } from '@components/input-error/input-error.module';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TranfersPageRoutingModule,
    CardAccountModule,
    ReactiveFormsModule,
    ManageAccountPageModule,
    HeaderModule,
    FooterModule,
    InputErrorModule
  ],
  declarations: [TransfersPage]
})
export class TransfersPageModule {}
