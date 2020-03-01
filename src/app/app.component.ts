import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Inicio',
      url: '/dashboard',
      icon: 'home-outline'
    },
    {
      title: 'Cuentas',
      url: '/folder/Cuentas',
      icon: 'journal-outline'
    },
    {
      title: 'Movimientos',
      url: '/folder/Movimientos',
      icon: 'trail-sign-outline'
    },
    {
      title: 'Transferencias',
      url: '/codi',
      icon: 'swap-horizontal-outline'
    },
    {
      title: 'Beneficiarios',
      url: '/folder/Beneficiarios',
      icon: 'people-outline'
    },
    {
      title: 'Ajustes',
      url: '/folder/Ajustes',
      icon: 'settings-outline'
    },
    {
      title: 'Nosotros',
      url: '/folder/Nosotros',
      icon: 'information-circle-outline'
    },
    {
      title: 'Ayuda',
      url: '/folder/Ayuda',
      icon: 'help-circle-outline'
    },
    {
      title: 'Compartir',
      url: '/folder/Compartir',
      icon: 'share-social-outline'
    },
    {
      title: 'Cerrar Sesión',
      url: '/folder/Logout',
      icon: 'log-out-outline'
    }
  ];
  public labels = ['V.0.0.1'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#285D4D");
      this.splashScreen.hide();
      //----
      if(1){ //if not login
        this.router.navigateByUrl('/home');
      }else{
        this.router.navigateByUrl('/dashboard');
      }
      //----
    });
  }

  ngOnInit() {

  }
}
