import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanSocialPage } from './plan-social.page';

const routes: Routes = [
  {
    path: '',
    component: PlanSocialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanSocialPageRoutingModule {}
