import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavingsPageRoutingModule } from './savings-routing.module';

import { SavingsPage } from './savings.page';
import { TranslateModule } from '@ngx-translate/core';

import { AccountModule } from '../account/account.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavingsPageRoutingModule,
    TranslateModule,
    AccountModule
  ],
  declarations: [SavingsPage]
})
export class SavingsPageModule {}
