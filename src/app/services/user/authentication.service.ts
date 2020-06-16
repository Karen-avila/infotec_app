import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';
import { Storage } from '@ionic/storage';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { ClientsService } from '@services/clients/clients.service';
import { UserService } from './user.service';
import { User } from '@globals/interfaces/user';
import { LoginInfo } from '@globals/interfaces/login-info';
import { PersonalInfo } from '@globals/interfaces/personal-info';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HelpersService } from '@services/helpers/helpers.service';
import { environment } from '@env';
import { TranslateService } from '@ngx-translate/core';
import { CodesService } from '@services/catalogs/codes.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';

  constructor(private httpClient: HttpClient,
    private storage: Storage,
    public toastController: ToastController,
    private clientsService: ClientsService,
    private navCtrl: NavController,
    private userService: UserService,
    private idle: Idle, 
    private helpersService: HelpersService,
    private translate: TranslateService,
    private alertController: AlertController,
    private codesService: CodesService
  ) {
    // this.platform.ready().then(() => {
    //   this.ifLoggedIn();
    // });
  }

  // la variable booleana sirve para ver si autenticamos directos o le hacemos ingresar el pin al usuario porque es un logeo nuevo
  public login(user: User, askForPin: boolean) {

    this.storage.remove('token');
    this.storage.remove('personal-info');
    this.storage.remove('login-info');

    this.helpersService.presentLoading();

    this.httpClient.post(ENDPOINTS.authentication, user)
      .toPromise()
      .then((login: LoginInfo) => {
        console.log(login);
        console.log(login.base64EncodedAuthenticationKey);

        this.storage.set('token', login.base64EncodedAuthenticationKey)
        this.storage.set('login-info', login)

        return this.storage.set('token', login.base64EncodedAuthenticationKey)
          .then(() => {
            console.log('<here>');
            return this.clientsService.getClient(login.clientId.toString()).toPromise();
          });
      })
      .then((client: PersonalInfo) => {
        this.authState.next(true);
        this.storage.set('personal-info', client);

        this.userService.username = user.username;
        this.userService.password = user.password;
        this.userService.displayName = client.displayName;

        return this.codesService.getMOBILE().toPromise();
      }).then( globals => {
        
        this.storage.set('globals', globals);
        if (askForPin) this.navCtrl.navigateRoot(['second-login', { type: 'pin' }]);
        else this.navCtrl.navigateRoot(['dashboard']);
      } )
      .catch(err => {
        console.log(err);
        this.helpersService.showErrorMessage('Login Error', 'The credentials entered are incorrect');
      }).finally( () => this.helpersService.hideLoading() );
  }

  public ifLoggedIn() {
    this.storage.get('token').then((response) => {
      if (response) {
        this.authState.next(true);
      }
    });
  }

  public simpleLogin(user: User): Observable<any> {
    return this.httpClient.post(ENDPOINTS.authentication, user);
  }

  public logout() {
    this.storage.remove('personal-info')
      .then(() => {
        return this.storage.remove('login-info')
      })
      .then(() => {
        return this.storage.remove('token')
      })
      .then(() => {
        return this.storage.get('user-hash')
      })
      .then(response => {
        this.authState.next(false);
        if (response) {
          this.navCtrl.navigateRoot(['/second-login', 'login']);
        } else {
          this.navCtrl.navigateRoot(['/login']);
        }
      })
  }

  public startIdleTimer() {
    
     this.idle.setIdle(5);
     this.idle.setTimeout(120);
     this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
 
     this.idle.onIdleEnd.subscribe(() => this.idle.watch());
     this.idle.onTimeout.subscribe(() => this.logout());

     this.idle.watch();
 
  }

  public isAuthenticated() {
    return this.authState.value || environment.mockLogin;
  }
}
