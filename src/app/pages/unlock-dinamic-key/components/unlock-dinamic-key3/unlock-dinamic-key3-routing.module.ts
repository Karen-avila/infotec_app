import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnlockDinamicKey3Page } from './unlock-dinamic-key3.page';

const routes: Routes = [
  {
    path: '',
    component: UnlockDinamicKey3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnlockDinamicKey3PageRoutingModule {}
