import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from '@core/guards/auth/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'second-login',
    loadChildren: () => import('@pages/second-login/second-login.module').then(m => m.SecondLoginPageModule)
  },
  {
    path: 'folder/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('@pages/folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('@pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('@pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('@pages/registration/registration.module').then(m => m.RegistrationPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('@pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'codi',
    canActivate: [AuthGuard],
    loadChildren: () => import('@pages/codi/codi.module').then(m => m.CodiPageModule)
  },
  {
    path: 'pay-codi/:payload',
    canActivate: [AuthGuard],
    loadChildren: () => import('@pages/codi/components/pay-codi/pay-codi.module').then(m => m.PayCodiPageModule)
  },
  {
    path: 'collect-codi',
    canActivate: [AuthGuard],
    loadChildren: () => import('@pages/codi/components/collect-codi/collect-codi.module').then(m => m.CollectCodiPageModule)
  },
  {
    path: 'soft-token',
    canActivate: [AuthGuard],
    loadChildren: () => import('@pages/soft-token/soft-token.module').then(m => m.SoftTokenPageModule)
  },
  {
    path: 'transfers',
    canActivate: [AuthGuard],
    loadChildren: () => import('@pages/transfers/transfers.module').then(m => m.TransfersPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'postponed',
    loadChildren: () => import('./pages/postponed/postponed.module').then(m => m.PostponedPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./pages/about-us/about-us.module').then(m => m.AboutUsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/logout/logout.module').then(m => m.LogoutPageModule)
  },
  {
    path: 'plan-social',
    loadChildren: () => import('./pages/plan-social/plan-social.module').then(m => m.PlanSocialPageModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'soft-token',
    loadChildren: () => import('./pages/soft-token/soft-token.module').then( m => m.SoftTokenPageModule)
  },
  {
    path: 'pay-order',
    loadChildren: () => import('./pages/pay-order/pay-order.module').then( m => m.PayOrderPageModule)
  },
  { path: "**", redirectTo: "not-found" },

];

@NgModule({
  imports: [
    TranslateModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
