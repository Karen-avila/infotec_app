import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnlockDinamicKey2PageRoutingModule } from './unlock-dinamic-key2-routing.module';

import { UnlockDinamicKey2Page } from './unlock-dinamic-key2.page';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorModule } from '@components/input-error/input-error.module';
import { UnlockDinamicKey3PageModule } from '../unlock-dinamic-key3/unlock-dinamic-key3.module';
import { UnlockDinamicKey3Page } from '../unlock-dinamic-key3/unlock-dinamic-key3.page';

@NgModule({
  entryComponents: [
    UnlockDinamicKey3Page
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnlockDinamicKey2PageRoutingModule,
    TranslateModule,
    InputErrorModule,
    UnlockDinamicKey3PageModule
  ],
  declarations: [UnlockDinamicKey2Page]
})
export class UnlockDinamicKey2PageModule {}
