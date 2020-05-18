import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';
import { Storage } from '@ionic/storage';
import { Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClientsService } from '@services/clients/clients.service';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient,
    private storage: Storage,
    private router: Router,
    private platform: Platform,
    public toastController: ToastController,
    private clientsService: ClientsService
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  public login(user: User) {

    this.storage.remove('token');

    this.httpClient.post(ENDPOINTS.authentication, user)
      .toPromise()
      .then((login: any) => {
        console.log(login.base64EncodedAuthenticationKey);

        this.storage.set('token', login.base64EncodedAuthenticationKey)

        return this.storage.set('token', login.base64EncodedAuthenticationKey)
          .then(() => {
            console.log('<here>');
            return this.clientsService.getClient(login.clientId).toPromise();
          });
      })
      .then(client => {
        this.authState.next(true);
        this.storage.set('personal-info', client);
        this.router.navigate(['/second-login',  {type: 'pin'}]); //second-login
      })
      .catch(err => {
        console.log(err);
      });
  }

  public logged() {
    this.authState.next(true);
  }

  public ifLoggedIn() {
    this.storage.get('token').then((response) => {
      if (response) {
        this.authState.next(true);
      }
    });
  }

  public logout() {
    this.storage.remove('personal-info')
    this.storage.remove('token').then(() => {
      this.router.navigate(['/login']);
      this.authState.next(false);
    
    });
  }

  public isAuthenticated() {
    console.log(this.authState.value);
    return this.authState.value;
  }
}
