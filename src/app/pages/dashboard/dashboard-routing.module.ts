import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'savings',
        loadChildren: () => import('./components/savings/savings.module').then( m => m.SavingsPageModule)
      },
      {
        path: 'loans',
        loadChildren: () => import('./components/loans/loans.module').then( m => m.LoansPageModule)
      },
      {
        path: 'investments',
        loadChildren: () => import('./components/investments/investments.module').then( m => m.InvestmentsPageModule)
      },
      {
        path: '',
        redirectTo: '/dashboard/savings',
        pathMatch: 'full'
      }
    ]
  }, {
    path: '',
    redirectTo: '/dashboard/savings',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
