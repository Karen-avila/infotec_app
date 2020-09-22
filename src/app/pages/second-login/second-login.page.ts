import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '@services/user/authentication.service';
import { NavController } from '@ionic/angular';
import { UserService } from '@services/user/user.service';
import { ModalController } from '@ionic/angular';
import { HelpersService } from '@services/helpers/helpers.service';
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';

const CryptoJS = require('crypto-js');

@Component({
  selector: 'app-second-login',
  templateUrl: './second-login.page.html',
  styleUrls: ['./second-login.page.scss']
})
export class SecondLoginPage implements OnInit {

  public limitSelected = 4;
  public seletedNumbers: number[] = [];
  public show = false;
  public pin = '';
  public type: 'pin' | 'confirm-pin' | 'login' = 'pin';
  private errorNumberCount = 0;
  public incorrectPin = false;
  public lastClientLogin = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private storage: Storage,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private helpersService: HelpersService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    const { type } = this.activatedRoute.snapshot.params;
    const { code } = this.activatedRoute.snapshot.queryParams;
    if (type !== 'pin' && type !== 'confirm-pin' && type !== 'login') {
      this.type = 'pin';
    } else {
      this.type = type;
    }
    this.pin = code || '';
    this.storage.get('last-client').then( lastCient => this.lastClientLogin = lastCient );
  }

  get lenSelectedNumbers(): number {
    return this.seletedNumbers.length;
  }

  get buttonDisabled(): boolean {
    let disabled = true;
    switch (this.type) {
      case 'pin':
        disabled = this.lenSelectedNumbers !== this.limitSelected;
        break;
      case 'confirm-pin':
        disabled = this.lenSelectedNumbers !== this.limitSelected || this.pin !== this.seletedNumbers.join('');
        break;
      case 'login':
        disabled = this.lenSelectedNumbers !== this.limitSelected;
        break;
    }
    return disabled;
  }

  get buttonText(): string {
    let label = '';
    switch (this.type) {
      case 'pin':
        label = 'Continue';
        break;
      case 'confirm-pin':
        label = 'Accept';
        break;
      case 'login':
        label = 'Login with PIN';
        break;
    }

    return label;
  }

  public add(number: number): void {
    this.incorrectPin = false;
    if (this.seletedNumbers.length >= this.limitSelected) {
      return;
    }
    this.seletedNumbers.push(number);
    console.log(this.seletedNumbers);
  }

  public delete(): void {
    this.incorrectPin = false;
    if (!this.seletedNumbers.length) {
      return;
    }
    this.seletedNumbers.pop();
    console.log(this.seletedNumbers);
  }

  public goToRoute(): void {
    switch (this.type) {
      case 'pin':
        this.navCtrl.navigateRoot(['/second-login', { type: 'confirm-pin' }], { queryParams: { code: this.seletedNumbers.join('') } });
        break;
      case 'confirm-pin':
        this.encryptPIN();
        this.navCtrl.navigateRoot(['/dashboard']);
        break;
      case 'login':
        this.decryptUser();
        break;
    }
  }

  public headerTitle() {
    if (this.type === 'login') { return 'Enter PIN'; }
    if (this.type === 'pin') { return 'Set PIN'; }
    if (this.type === 'confirm-pin' && this.limitSelected === this.lenSelectedNumbers && this.buttonDisabled) {
      this.incorrectPin = true;
    }
    if (this.type === 'confirm-pin') { return 'Confirm PIN'; }
  }

  public showBackButton() {
    return this.type === 'pin' || this.type === 'confirm-pin' ? true : false;
  }

  public showRegisterButton() {
    return this.type === 'pin' || this.type === 'confirm-pin' ? false : true;
  }

  public showSignInButton() {
    return this.type === 'pin' || this.type === 'confirm-pin' ? false : true;
  }

  private async encryptPIN() {
    const PIN = this.seletedNumbers.join('');
    const user = { username: this.userService.username, password: this.userService.password };
    const userString = JSON.stringify(user);
    const ciphertext = CryptoJS.AES.encrypt(userString, PIN).toString();
    this.storage.set('user-hash', ciphertext);
  }

  public goLogin() {
    this.authenticationService.logout(true);
  }

  private async decryptUser() {
    const PIN = this.seletedNumbers.join('');
    this.incorrectPin = false;
    this.storage.get('user-hash')
      .then(encryptedUser => {
        const bytes = CryptoJS.AES.decrypt(encryptedUser, PIN);
        const usuario = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.authenticationService.login(usuario, false);
      })
      .catch(err => {
        console.log(err);
        // alert("El PIN ingresado es incorrecto");
        this.incorrectPin = true;
        this.seletedNumbers = [];
        this.errorNumberCount++;
        // si el usuario pone mal el pin 3 veces, lo mandamos al login y borramos el hash guardado
        if (this.errorNumberCount === 3) {
          this.storage.remove('user-hash');
          this.navCtrl.navigateRoot(['/login']);
        }
      });
  }

  openUnlock() {
    this.helpersService.unlockDinamicKeyMessage([
      () => this.codeMail(),
    ]);
  }

  codeMail() {
    this.helpersService.codeMailMessage([
      () => this.unblockSuccessToken(),
    ]);
  }

  unblockSuccessToken() {
    this.helpersService.unblockSuccessTokenMessage([
      // () => this.sendUnblockMail(),
    ]);
  }

  // async openUnlock() {
    // const modal = await this.modalCtrl.create({
        // component: UnlockDinamicKeyPage,
        // cssClass: 'modal'
      // });
    // return await modal.present();
  // }

}
