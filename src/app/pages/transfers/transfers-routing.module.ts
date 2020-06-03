import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransfersPage } from './transfers.page';
import { AuthGuard } from '@core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TransfersPage
  },
  {
    path: 'manage-account',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/manage-account/manage-account.module').then( m => m.ManageAccountPageModule)
  },
  {
    path: 'success',
    canActivate: [AuthGuard],
    loadChildren: () => import('@pages/transfers/components/success/success.module').then( m => m.SuccessPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TranfersPageRoutingModule {}
