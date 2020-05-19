import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private titleService: Title,
    private router: Router,
    private storage: Storage,
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

    this.storage.get('user-hash')
      .then(response => {
        if (response) {
          this.router.navigate(['/second-login', 'login']);
        } else {
          this.router.navigate(['/login']);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  ngOnInit() {
  }


}
