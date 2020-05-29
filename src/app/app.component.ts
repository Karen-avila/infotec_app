import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { HelpersService } from '@services/helpers/helpers.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/user/authentication.service';
import { Storage } from '@ionic/storage';
import { ClientsService } from '@services/clients/clients.service';

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
    {
      title: 'Ajustes',
      url: '/settings',
      icon: 'settings-outline'
    },
    {
      title: 'Nosotros',
      url: '/about-us',
      icon: 'information-circle-outline'
    },
    {
      title: 'Ayuda',
      url: '/help',
      icon: 'help-circle-outline'
    },
    {
      title: 'Compartir',
      funtion: this.share.bind(this),
      icon: 'share-social-outline'
    },
    {
      title: 'Cerrar Sesión',
      funtion: this.logout.bind(this),
      icon: 'log-out-outline',
    }
  ];
  public labels = ['V.0.0.1'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private titleService: Title,
    private helpersService: HelpersService,
    private socialSharing: SocialSharing,
    private router: Router,
    private storage: Storage,
    private authenticationService: AuthenticationService
  ) {
    this.initializeApp();
  }

  initializeApp() {

    console.log(navigator.language);

    this.translate.setDefaultLang(navigator.language.substring(0, 2));
    this.translate.get('title').subscribe((res: string) => this.titleService.setTitle(res));
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#285D4D");
      this.splashScreen.hide();
    });

    // this.router.navigate(['/dashboard']);

    // this.storage.get('user-hash')
    //   .then(response => {
    //     if (response) {
    //       this.router.navigate(['/second-login', 'login']);
    //     } else {
    //       this.router.navigate(['/login']);
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  public share(): void {
    this.socialSharing.share('message', 'subject', null, 'https://www.gob.mx/bancodelbienestar');
  }

  public logout(): void {
    this.selectedIndex = 6;
    this.translate.get([
      'Sign off', 
      'Do you want to exit the app?'
    ]).subscribe( (resp: any) => {
      this.helpersService
        .showAlert(resp.Reject, resp['Do you want to exit the app?'])
        .then( () => this.router.navigate(['/login']) );
    } )
  } 

  ngOnInit() {
  }

  public isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }


}
