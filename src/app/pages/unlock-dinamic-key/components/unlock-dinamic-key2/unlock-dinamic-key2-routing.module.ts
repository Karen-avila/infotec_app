import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnlockDinamicKey2Page } from './unlock-dinamic-key2.page';

const routes: Routes = [
  {
    path: '',
    component: UnlockDinamicKey2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnlockDinamicKey2PageRoutingModule {}
