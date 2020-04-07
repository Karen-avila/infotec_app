import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransfersPage } from './transfers.page';

const routes: Routes = [
  {
    path: '',
    component: TransfersPage
  },
  {
    path: 'manage-account',
    loadChildren: () => import('./components/manage-account/manage-account.module').then( m => m.ManageAccountPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TranfersPageRoutingModule {}
