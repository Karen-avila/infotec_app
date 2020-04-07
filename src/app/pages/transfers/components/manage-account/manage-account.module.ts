import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageAccountPageRoutingModule } from './manage-account-routing.module';

import { ManageAccountPage } from './manage-account.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageAccountPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [ManageAccountPage],
  entryComponents: [ManageAccountPage]
})
export class ManageAccountPageModule {}