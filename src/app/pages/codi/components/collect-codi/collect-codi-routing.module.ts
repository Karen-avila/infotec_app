import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectCodiPage } from './collect-codi.page';

const routes: Routes = [
  {
    path: '',
    component: CollectCodiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectCodiPageRoutingModule {}
