import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficesPageRoutingModule } from './offices-routing.module';

import { OfficesPage } from './offices.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficesPageRoutingModule,
    TranslateModule
  ],
  declarations: [OfficesPage]
})
export class OfficesPageModule {}
