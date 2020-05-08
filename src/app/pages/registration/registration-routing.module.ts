import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationPage } from './registration.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () => import('./components/tab1/tab1.module').then( m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () => import('./components/tab2/tab2.module').then( m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/registration/tab1',
        pathMatch: 'full'
      }
    ],
  },
  {
    path: '',
    redirectTo: '/registration',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationPageRoutingModule {}
