import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { AuthenticationService } from '@services/user/authentication.service';
import { ClientsService } from '@services/clients/clients.service';
import { PersonalInfo } from '@globals/interfaces/personal-info';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private clientsService: ClientsService
  ) { }

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
      url: '/folder/Compartir',
      icon: 'share-social-outline'
    },
    {
      title: 'Cerrar Sesión',
      url: '/logout',
      icon: 'log-out-outline'
    }
  ];

  public labels = ['V.0.0.1'];
  public personalInfo: PersonalInfo;

  ngOnInit() {
    this.getPersonalInfo();
  }

  public isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }

  public getPersonalInfo() {
    this.clientsService.getPersonalInfo()
      .then((data: PersonalInfo) => {
        this.personalInfo = data;
        console.log(data);
      });
  }

}
