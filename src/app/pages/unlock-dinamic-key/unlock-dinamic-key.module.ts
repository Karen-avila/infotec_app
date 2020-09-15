import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnlockDinamicKeyPageRoutingModule } from './unlock-dinamic-key-routing.module';

import { UnlockDinamicKeyPage } from './unlock-dinamic-key.page';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorModule } from '@components/input-error/input-error.module';
import { UnlockDinamicKey2Page } from './components/unlock-dinamic-key2/unlock-dinamic-key2.page';
import { UnlockDinamicKey2PageModule } from './components/unlock-dinamic-key2/unlock-dinamic-key2.module';
@NgModule({
  entryComponents: [
    UnlockDinamicKey2Page
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnlockDinamicKeyPageRoutingModule,
    TranslateModule,
    InputErrorModule,
    UnlockDinamicKey2PageModule
  ],
  declarations: [UnlockDinamicKeyPage]
})
export class UnlockDinamicKeyPageModule {}
