import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';
import { Storage } from '@ionic/storage';
import { ToastController, NavController, AlertController, MenuController } from '@ionic/angular';
import { ClientsService } from '@services/clients/clients.service';
import { UserService } from './user.service';
import { User } from '@globals/interfaces/user';
import { LoginInfo } from '@globals/interfaces/login-info';
import { PersonalInfo } from '@globals/interfaces/personal-info';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HelpersService } from '@services/helpers/helpers.service';
import { environment } from '@env';
import { CodesService } from '@services/catalogs/codes.service';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  timetoSessionAlert = 90;
  timetoSessionClose = 30;
  sessionAlert = null;
  authState = new BehaviorSubject(false);
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';

  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    public toastController: ToastController,
    private clientsService: ClientsService,
    private navCtrl: NavController,
    private userService: UserService,
    private idle: Idle,
    private helpersService: HelpersService,
    private codesService: CodesService,
    private menu: MenuController
  ) {}

  // la variable booleana sirve para ver si autenticamos directos o le hacemos ingresar el pin al usuario porque es un logeo nuevo
  public login(user: User, askForPin: boolean): Promise<any> {

    this.storage.remove('token');
    this.storage.remove('personal-info');
    this.storage.remove('login-info');
    this.helpersService.presentLoading();
    return this.httpClient.post(ENDPOINTS.authentication, user)
      .toPromise()
      .then((login: LoginInfo) => {
        console.log(login);
        console.log(login.base64EncodedAuthenticationKey);
        this.storage.set('token', login.base64EncodedAuthenticationKey);
        this.storage.set('login-info', login);
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
        const displayName = client.displayName.trim().replace(/ +(?= )/g, '').split(' ');
        const shortName = `${displayName[0]}${ displayName[1] ? ' ' + displayName[1] : '' }`;
        this.userService.shortName = shortName;
        this.storage.set('last-client', shortName);
        this.clientsService.getSelfie(client.id + '').toPromise()
          .then( imageUrl => this.storage.set('image-profile', imageUrl) )
          .catch( err => {
            if (!(err.status && err.status === 200 && err.error.text)) { return; }
            this.storage.set('image-profile', err.error.text.replace(/\s/g, ''));
          } );
        return this.codesService.getMOBILE().toPromise();
      }).then( globals => {
        this.storage.set('globals', globals);
        console.log(globals);
        if (askForPin) { this.navCtrl.navigateRoot(['second-login', { type: 'pin' }]); } else { this.navCtrl.navigateRoot(['dashboard']); }
        this.storage.remove('timeLeft');
        return true;
      } )
      .catch(err => {
        console.log(err);
        this.helpersService.showErrorMessage('Login Error', 'The credentials entered are incorrect');
        throw err;
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

  public async logout(removeAllStorage: boolean = false) {
    const keep: string[] = ['user-hash', 'last-client'];
    const saved: any[] = [];
    if (!removeAllStorage) {
      for (const key in keep) {
        const value = await this.storage.get(keep[key]);
        saved.push({ key: keep[key], value });
      }
    }
    this.storage.clear();
    for (const key in saved) {
      this.storage.set(saved[key].key, saved[key].value);
    }
    this.authState.next(false);
    this.navCtrl.navigateRoot(['/login']);
  }

  public startIdleTimer() {
    // Incializa variables
    this.idle.setIdle(this.timetoSessionAlert);
    this.idle.setTimeout(this.timetoSessionClose);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // Funcion que elimina los observes del idle
    const stop = (() => {
      this.idle.stop();
      this.idle.onTimeout.observers.length = 0;
      this.idle.onIdleStart.observers.length = 0;
      this.idle.onIdleEnd.observers.length = 0;
      this.idle.onTimeoutWarning.observers.length = 0;
    })

    // Se ejecuta cuando el idle es cancelado
    this.idle.onIdleEnd.subscribe(() => {
    });

    // Se ejecuta cuando el tiempo se acaba
    this.idle.onTimeout.subscribe(() => {
      stop();
      this.sessionAlert.dismiss();
      this.menu.enable(false);
      this.logout();
    });

    // Crea mensaje de alerta
    this.idle.onIdleStart.subscribe(() => {
      this.helpersService.successMessage(
        'Aun estas ahi?',
        'Tu sesión se cerrará pronto'
      ).then(alert => {
        this.sessionAlert = alert;
        this.sessionAlert.present();
      });
    });

    // Se puede usar para hacer un conteo regresivo asignando countdown
    this.idle.onTimeoutWarning.subscribe((countdown: string) => {
      // console.log('onTimeoutWarning', this.idle.isRunning());
    });

    // Inicia el idle
    if (!this.idle.isRunning() && environment.production) {
      this.idle.watch();
    }

  }

  public isAuthenticated() {
    return this.authState.value || environment.mockLogin;
  }
}
