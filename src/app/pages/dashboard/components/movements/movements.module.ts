import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovementsPageRoutingModule } from './movements-routing.module';

import { MovementsPage } from './movements.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovementsPageRoutingModule,
    TranslateModule
  ],
  declarations: [MovementsPage],
  entryComponents: [MovementsPage]
})
export class MovementsPageModule {}
