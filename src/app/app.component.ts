import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

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
      title: 'Transferencias',
      url: '/transfers',
      icon: 'swap-horizontal-outline'
    },
    // {
    //   title: 'CoDi',
    //   url: '/codi',
    //   icon: 'swap-horizontal-outline'
    // },
    {
      title: 'Ajustes',
      url: '/folder/Ajustes',
      icon: 'settings-outline'
    },
    {
      title: 'Nosotros',
      url: '/about',
      icon: 'information-circle-outline'
    },
    {
      title: 'Ayuda',
      url: '/help',
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
    private translate: TranslateService,
    private titleService: Title
  ) {
    this.initializeApp();
  }

  initializeApp() {

    console.log(navigator.language);

    this.translate.setDefaultLang(navigator.language.substring(0, 2));
    this.translate.get('title').subscribe((res: string) => this.titleService.setTitle(res) );
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#285D4D");
      this.splashScreen.hide();
    });
  }

  ngOnInit() {

  }
}
