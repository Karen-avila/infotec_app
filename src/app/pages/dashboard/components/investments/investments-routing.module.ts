import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestmentsPage } from './investments.page';

const routes: Routes = [
  {
    path: '',
    component: InvestmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestmentsPageRoutingModule {}
