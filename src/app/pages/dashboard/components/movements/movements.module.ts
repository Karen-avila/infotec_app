import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovementsPageRoutingModule } from './movements-routing.module';

import { MovementsPage } from './movements.page';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from '@components/header/header.module';
import { FooterModule } from '@components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovementsPageRoutingModule,
    TranslateModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [MovementsPage],
  entryComponents: [MovementsPage]
})
export class MovementsPageModule {}
