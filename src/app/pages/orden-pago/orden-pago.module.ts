import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenPagoPageRoutingModule } from './orden-pago-routing.module';

import { OrdenPagoPage } from './orden-pago.page';
import { TranslateModule } from '@ngx-translate/core';
import { CardAccountModule } from '@components/card-account/card-account.module';
import { ManageAccountPageModule } from '@pages/transfers/components/manage-account/manage-account.module';
import { HeaderModule } from '@components/header/header.module';
import { FooterModule } from '@components/footer/footer.module';
import { NgxBarcodeModule } from 'ngx-barcode';


@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenPagoPageRoutingModule,
    CardAccountModule,
    ReactiveFormsModule,
    ManageAccountPageModule,
    HeaderModule,
    FooterModule,
    NgxBarcodeModule
  ],
  declarations: [OrdenPagoPage]
})
export class OrdenPagoPageModule {}
