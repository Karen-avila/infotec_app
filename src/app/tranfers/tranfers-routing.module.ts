import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TranfersPage } from './tranfers.page';

const routes: Routes = [
  {
    path: '',
    component: TranfersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TranfersPageRoutingModule {}
