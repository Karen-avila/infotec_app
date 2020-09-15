import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnlockDinamicKeyPage } from './unlock-dinamic-key.page';

const routes: Routes = [
  {
    path: '',
    component: UnlockDinamicKeyPage
  },
  {
    path: 'unlock-dinamic-key2',
    loadChildren: () => import('./components/unlock-dinamic-key2/unlock-dinamic-key2.module').then( m => m.UnlockDinamicKey2PageModule)
  },
  {
    path: 'unlock-dinamic-key3',
    loadChildren: () => import('./components/unlock-dinamic-key3/unlock-dinamic-key3.module').then( m => m.UnlockDinamicKey3PageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnlockDinamicKeyPageRoutingModule {}
