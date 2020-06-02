import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuccessComponent } from './success.page';


const routes: Routes = [
  {
    path: '',
    component: SuccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessPageRoutingModule {}
