import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CardAccountComponent } from './card-account.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [CardAccountComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CardAccountComponent],
  providers: [CurrencyPipe]
})
export class CardAccountModule { }
