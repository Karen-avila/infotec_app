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
    // this.platform.ready().then(() => {
    //   this.ifLoggedIn();
    // });
  }

  // la variable booleana sirve para ver si autenticamos directos o le hacemos ingresar el pin al usuario porque es un logeo nuevo
  public login(user: User, askForPin: boolean) {

    this.storage.remove('token');
    this.storage.remove('personal-info');

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

        if (askForPin) this.router.navigate(['/second-login', { type: 'pin', username: user.username, password: user.password }]); //second-login
        else this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        console.log(err);
      });
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
      .then(() => {
        return this.storage.remove('token')
      })
      .then(() => {
        return this.storage.get('user-hash')
      })
      .then(response => {
        this.authState.next(false);
        if (response) {
          this.router.navigate(['/second-login', 'login']);
        } else {
          this.router.navigate(['/login']);
        }
      })
  }

  public isAuthenticated() {
    return this.authState.value;
  }
}
