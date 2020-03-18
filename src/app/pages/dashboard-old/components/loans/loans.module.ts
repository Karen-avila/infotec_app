import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoansPageRoutingModule } from './loans-routing.module';

import { LoansPage } from './loans.page';
import { AccountModule } from '../account/account.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoansPageRoutingModule,
    AccountModule
  ],
  declarations: [LoansPage]
})
export class LoansPageModule {}
