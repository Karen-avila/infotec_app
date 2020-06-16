import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ClientsService } from '@services/clients/clients.service';
import { PersonalInfo } from '@globals/interfaces/personal-info';
import { UserService } from '@services/user/user.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '@services/user/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  constructor(
    private clientsService: ClientsService,
    public userService: UserService,
    private socialSharing: SocialSharing,
    private storage: Storage,
    private authentication: AuthenticationService
  ) {
    this.getPersonalInfo();
  }

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/dashboard',
      icon: 'home-outline'
    },
    {
      title: 'Transfers',
      url: '/transfers',
      icon: 'swap-horizontal-outline'
    },
    {
      title: 'Pay Order',
      url: '/pay-order',
      icon: 'wallet-outline'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings-outline'
    },
    {
      title: 'About Us',
      url: '/about-us',
      icon: 'information-circle-outline'
    },
    {
      title: 'Help',
      url: '/help',
      icon: 'help-circle-outline'
    },
    {
      title: 'Share',
      funtion: this.share.bind(this),
      icon: 'share-social-outline'
    },
    {
      title: 'Sign off',
      funtion: this.logout.bind(this),
      icon: 'log-out-outline'
    }
  ];

  public labels = ['V.0.0.1'];
  public personalInfo: PersonalInfo;
  public avatarUrl: string = '/assets/header-icons/leona.png';

  ngOnInit() {
    this.storage.get('image-profile').then(image => {
      if (image) {
        this.avatarUrl = image;
      }
    })
  }

  //TODO: Agregar el translate y el servicios para traer los globals
  public share(index: number): void {
    this.selectedIndex = index;
    this.socialSharing.share('Banco del Bienestar', null, null, 'https://www.gob.mx/bancodelbienestar');
  }

  public logout() {
    this.authentication.logout();
  }

  private getPersonalInfo() {
    this.clientsService.getPersonalInfo()
      .then((data: PersonalInfo) => {
        this.personalInfo = data;
      });
  }
}
