import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@services/user/authentication.service';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HelpersService } from '@services/helpers/helpers.service';

const CryptoJS = require('crypto-js');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  icon = true;
  type = 'password';
  loginForm: FormGroup;
  disabledButtons = false;
  interval;
  textTitle = '';
  showImage = true;

  constructor(
      public formBuilder: FormBuilder,
      private authenticationService: AuthenticationService,
      private navCtrl: NavController,
      private helpersService: HelpersService,
      protected translate: TranslateService
    ) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])]
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.showImage = true;
  }

  ionViewWillLeave() {
    this.showImage = false;
  }

  public Route(route: string) {
    this.showImage = false;
    this.navCtrl.navigateRoot([route]);
  }

  toOnlyRegex(key: string, regex: string, uppercase: boolean = true) {
    const inputName = this.loginForm.get(key);
    // tslint:disable-next-line: max-line-length
    inputName.valueChanges.subscribe(value => inputName.setValue((uppercase ? value.toUpperCase() : value).replace(new RegExp(regex, 'g'), ''), { emitEvent: false }));
  }

  signIn() {
    const form = { ...this.loginForm.value };
    form.password = CryptoJS.SHA256(form.password).toString(CryptoJS.enc.Hex);
    this.authenticationService.login(form, true).catch( async err => {
      if (err.error && err.error.userMessageGlobalisationCode === 'error.msg.not.authenticated') {
        this.blockYourAccount(form);
      }
    });
  }

  blockYourAccount(form) {
    this.helpersService.blockYourAccountMessage(
      'Inicio de sesión bloqueado',
      'Recuperar'
    ).then(async alert => {
      const wrapper: any = document.querySelector('.alert-wrapper');
      wrapper.innerHTML = '';
      wrapper.style.borderRadius = '20px';
      wrapper.style.position = 'relative';
      wrapper.insertAdjacentHTML('afterbegin', `
        <img style="width: 100%; height: auto;" src="./assets/sin-internet.png" alt="Sin internet">
        <ion-text
          style="position: absolute; top: 7%; left: 8%; width: 85%; text-transform: uppercase; text-align: center; font-weight: bold"
        >
          ${ await this.translate.get('Inicio de sesión bloqueado').toPromise() }
        </ion-text>
        <ion-text
          style="position: absolute; top: 38%; left: 14%; width: 72%; text-transform: uppercase; text-align: center; font-weight: bold"
        >
          ${ await this.translate.get('Recuperar!').toPromise() }
        </ion-text>
        <ion-text
          style="position: absolute; top: 45%; left: 10%; width: 80%; font-size: 90%; text-align: center; text-align: justify;"
        >
          ${ await this.translate.get('Has bloqueado tu banca móvil por 3 intentos fallidos de inicio de sesión, para desbloquear tu cuenta oprime el boton de DESBLOQUEAR y sigue los pasos del proceso de desbloqueo de tu cuentna').toPromise() }
        </ion-text>
        <ion-button
          expand="block"
          id=""
          color="primary"
          style="position: absolute; top: 73%; left: 14%; width: 72%; text-transform: uppercase;"
        >${ await this.translate.get('DESBLOQUEAR').toPromise() }
        </ion-button>
        <ion-button
          expand="block"
          id="btnClose"
          color="medium"
          style="position: absolute; top: 85%; left: 14%; width: 72%; text-transform: uppercase;"
        >${ await this.translate.get('CANCELAR').toPromise() }
        </ion-button>
      `);
      document.querySelector('#btnClose').addEventListener('click', () => {
        console.log('destruir');
        alert.dismiss();
      });
      alert.present();
    });
  }

  sendUnblockMail() {

  }

  getCodeMail() {

  }

  UnblockSuccess() {

  }

  viewPassword() {
    if (this.icon) {
      this.icon = false;
      this.type = 'text';
    } else {
      this.icon = true;
      this.type = 'password';
    }
  }

}
