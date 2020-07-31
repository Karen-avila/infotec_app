import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationPage } from './registration.page';
import { RegistrationGuard } from '@core/guards/registration/registration.guard';

const routes: Routes = [
  {
    path: '',
    component: RegistrationPage
  },
  {
    path: ':type/tab1',
    canActivate: [RegistrationGuard],
    loadChildren: () => import('./components/tab1/tab1.module').then( m => m.Tab1PageModule)
  },
  {
    path: ':type/tab2',
    canActivate: [RegistrationGuard],
    loadChildren: () => import('./components/tab2/tab2.module').then( m => m.Tab2PageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationPageRoutingModule {}
