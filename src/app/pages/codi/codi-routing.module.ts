import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodiPage } from './codi.page';

const routes: Routes = [
  {
    path: '',
    component: CodiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodiPageRoutingModule {}
