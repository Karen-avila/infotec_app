import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnlockDinamicKey3PageRoutingModule } from './unlock-dinamic-key3-routing.module';

import { UnlockDinamicKey3Page } from './unlock-dinamic-key3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnlockDinamicKey3PageRoutingModule
  ],
  declarations: [UnlockDinamicKey3Page]
})
export class UnlockDinamicKey3PageModule {}
