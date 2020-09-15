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
    this.helpersService.sendUnblockMail(
      'Desbloquear Cuenta',
      'INGRESA TUS DATOS!'
    ).then(async alert => {
      const wrapper: any = document.querySelector('.alert-wrapper');
      wrapper.innerHTML = '';
      wrapper.style.borderRadius = '20px';
      wrapper.style.position = 'relative';
      wrapper.insertAdjacentHTML('afterbegin', `
        <img style="width: 100%; height: auto;" src="./assets/sin-internet.png" alt="Sin internet">
        <ion-text style="position: absolute;
                          top: 7%;
                          left: 8%;
                          width: 85%;
                          text-align: center;
                          font-weight: bold">
          ${ await this.translate.get('Desbloquear Cuenta').toPromise()}
        </ion-text>
        <ion-text style="position: absolute;
                          top: 38%;
                          left: 14%;
                          width: 72%;
                          text-transform: uppercase;
                          text-align: center;
                          font-weight: bold">
          ${ await this.translate.get('Ingresa tus datos!').toPromise()}
        </ion-text>
        <ion-text style="position: absolute;
                          top: 45%;
                          left: 10%;
                          width: 80%;
                          font-size: 90%;
                          text-align: center;
                          text-align: justify;">
          ${ await this.translate.get('Para continuar con el proceso de desbloueo...').toPromise()}
        </ion-text>
        <ion-input type="text" placeholder="Escribe tu CURP"
                  style="position: absolute;
                          top: 55%;
                          left: 10%;
                          border-buttom: 1px solid black;
                          width: 80%;
                          font-size: 90%;
                          text-align: center;
                          text-align: justify;">
          ${ await this.translate.get('- ').toPromise()}
        </ion-input>
        <ion-input type="text" placeholder="Escribe tu correo"
                  style="position: absolute;
                          top: 65%;
                          left: 10%;
                          border-buttom: 1px solid black;
                          width: 80%;
                          font-size: 90%;
                          text-align: center;
                          text-align: justify;">
          ${ await this.translate.get('- ').toPromise()}
        </ion-input>
        <ion-button expand="block"
                    id=""
                    color="primary"
                    style="position: absolute;
                    top: 73%;
                    left: 14%;
                    width: 72%;
                    text-transform:
                    uppercase;">
          ${ await this.translate.get('VALIDAR').toPromise()}
        </ion-button>
        <ion-button expand="block"
                    id="btnClose"
                    color="medium"
                    style="position: absolute;
                    top: 85%;
                    left: 14%;
                    width: 72%;
                    text-transform: uppercase;">
          ${ await this.translate.get('CANCELAR').toPromise()}
        </ion-button>
      `);
      document.querySelector('#btnClose').addEventListener('click', () => {
        console.log('destruir');
        alert.dismiss();
      });
      alert.present();
    });
  }

  getCodeMail() {
    this.helpersService.getCodeMail(
      'Sólo un paso más',
      'REVISA TU CORREO!'
    ).then(async alert => {
      const wrapper: any = document.querySelector('.alert-wrapper');
      wrapper.innerHTML = '';
      wrapper.style.borderRadius = '20px';
      wrapper.style.position = 'relative';
      wrapper.insertAdjacentHTML('afterbegin', `
        <img style="width: 100%;
                    height: auto;
                    " src="./assets/sin-internet.png"
                    alt="Sin internet">
        <ion-text style="position: absolute;
                          top: 7%;
                          left: 8%;
                          width: 85%;
                          text-align: center;
                          font-weight: bold">
          ${ await this.translate.get('Sólo un paso más').toPromise()}
        </ion-text>
        <ion-text style="position: absolute;
                          top: 25%;
                          left: 14%;
                          width: 72%;
                          text-transform: uppercase;
                          text-align: center;
                          font-weight: bold">
          ${ await this.translate.get('Revisa tu correo!').toPromise()}
        </ion-text>
        <ion-text style="position: absolute;
                          top: 35%;
                          left: 10%;
                          width: 80%;
                          font-size: 90%;
                          text-align: center;
                          text-align: justify;">
          ${ await this.translate.get('Para finalizar el proceso de desbloqueo, revisa tu correo, te deberá haber llegado un código de desbloqueo que deberás proporcionar a continuación').toPromise()}
        </ion-text>
        <ion-input type="text" placeholder="Escribe tu código"
                  style="position: absolute;
                          top: 50%;
                          left: 10%;
                          border-buttom: 1px solid black;
                          width: 80%;
                          font-size: 90%;
                          text-align: center;
                          text-align: justify;">
          ${ await this.translate.get('- ').toPromise()}
        </ion-input>
        <ion-input type="text" placeholder="Escribe tu contraseña"
                  style="position: absolute;
                          top: 57%;
                          left: 10%;
                          border-buttom: 1px solid black;
                          width: 80%;
                          font-size: 90%;
                          text-align: center;
                          text-align: justify;">
          ${ await this.translate.get('- ').toPromise()}
        </ion-input>
        <ion-input type="text" placeholder="Confirma tu contraseña"
                  style="position: absolute;
                          top: 64%;
                          left: 10%;
                          border-buttom: 1px solid black;
                          width: 80%;
                          font-size: 90%;
                          text-align: center;
                          text-align: justify;">
          ${ await this.translate.get('- ').toPromise()}
        </ion-input>
        <ion-button expand="block"
                    id=""
                    color="primary"
                    style="position: absolute;
                    top: 73%;
                    left: 14%;
                    width: 72%;
                    text-transform:
                    uppercase;">
          ${ await this.translate.get('ACEPTAR').toPromise()}
        </ion-button>
        <ion-button expand="block"
                    id="btnClose"
                    color="medium"
                    style="position: absolute;
                    top: 85%;
                    left: 14%;
                    width: 72%;
                    text-transform: uppercase;">
          ${ await this.translate.get('CANCELAR').toPromise()}
        </ion-button>
      `);
      document.querySelector('#btnClose').addEventListener('click', () => {
        console.log('destruir');
        alert.dismiss();
      });
      alert.present();
    });
  }

  UnblockSuccess() {
    this.helpersService.UnblockSuccess(
      'Desbloqueo Exitoso',
      'YA PUEDES INGRESAR!'
    ).then(async alert => {
      const wrapper: any = document.querySelector('.alert-wrapper');
      wrapper.innerHTML = '';
      wrapper.style.borderRadius = '20px';
      wrapper.style.position = 'relative';
      wrapper.insertAdjacentHTML('afterbegin', `
        <img style="width: 100%;
                    height: auto;
                    " src="./assets/sin-internet.png"
                    alt="Sin internet">
        <ion-text style="position: absolute;
                          top: 7%;
                          left: 8%;
                          width: 85%;
                          text-align: center;
                          font-weight: bold">
          ${ await this.translate.get('Desbloqueo Exitoso').toPromise()}
        </ion-text>
        <ion-text style="position: absolute;
                          top: 38%;
                          left: 14%;
                          width: 72%;
                          text-transform: uppercase;
                          text-align: center;
                          font-weight: bold">
          ${ await this.translate.get('Ya puedes ingresar!').toPromise()}
        </ion-text>
        <ion-text style="position: absolute;
                          top: 45%;
                          left: 10%;
                          width: 80%;
                          font-size: 90%;
                          text-align: center;
                          text-align: justify;">
          ${ await this.translate.get('El proceso de desbloqueo de tu cuenta se completó exitosamente, ya puedes ingresar a tu Banca Móvil con tu usuario y nueva contraseña').toPromise()}
        </ion-text>
        <ion-button expand="block"
                    id=""
                    color="primary"
                    style="position: absolute;
                    top: 75%;
                    left: 14%;
                    width: 72%;
                    text-transform:
                    uppercase;">
          ${ await this.translate.get('ACEPTAR').toPromise()}
        </ion-button>
      `);
      document.querySelector('#btnClose').addEventListener('click', () => {
        console.log('destruir');
        alert.dismiss();
      });
      alert.present();
    });
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
