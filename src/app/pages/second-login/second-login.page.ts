import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '@services/user/authentication.service';
import { NavController } from '@ionic/angular';
import { UserService } from '@services/user/user.service';

var CryptoJS = require("crypto-js");

@Component({
  selector: 'app-second-login',
  templateUrl: './second-login.page.html',
  styleUrls: ['./second-login.page.scss']
})
export class SecondLoginPage implements OnInit {

  public limitSelected: number = 4;

  public seletedNumbers: number[] = [];

  public show: boolean = false;

  public pin: string = '';

  public type: 'pin' | 'confirm-pin' | 'login' = 'pin';

  private errorNumberCount: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private navCtrl: NavController, private storage: Storage, private authenticationService: AuthenticationService, private userService: UserService) { }

  ngOnInit() {
    
    const { type } = this.activatedRoute.snapshot.params;
    const { code } = this.activatedRoute.snapshot.queryParams;

    if (type !== 'pin' && type !== 'confirm-pin' && type !== 'login') {
      this.type = 'pin';
    } else {
      this.type = type;
    }
    this.pin = code || '';
    console.log(this.type, this.pin);

  }

  get lenSelectedNumbers(): number {
    return this.seletedNumbers.length;
  }

  get buttonDisabled(): boolean {
    let disabled: boolean = true;

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
    let label: string = '';

    switch (this.type) {
      case 'pin':
        label = 'Continue';
        break;

      case 'confirm-pin':
        label = 'Accept';
        break;

      case 'login':
        label = 'Ingresar con PIN';
        break;
    }

    return label;
  }

  public add(number: number): void {
    if (this.seletedNumbers.length >= this.limitSelected) {
      return;
    }
    this.seletedNumbers.push(number);
    console.log(this.seletedNumbers);
  }

  public delete(): void {
    if (!this.seletedNumbers.length) {
      return;
    }
    this.seletedNumbers.pop();
    console.log(this.seletedNumbers);
  }

  public goToRoute(): void {
    switch (this.type) {
      case 'pin':
        this.navCtrl.navigateRoot(['/second-login', { type: 'confirm-pin'}], { queryParams: { code: this.seletedNumbers.join('') } })
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

  private async encryptPIN() {

    const PIN = this.seletedNumbers.join('');

    let user = { username: this.userService.username, password: this.userService.password };
    let userString = JSON.stringify(user);

    var ciphertext = CryptoJS.AES.encrypt(userString, PIN).toString();
    this.storage.set('user-hash', ciphertext);
  }

  private async decryptUser() {
    const PIN = this.seletedNumbers.join('');

    this.storage.get('user-hash')
      .then(encryptedUser => {
        var bytes = CryptoJS.AES.decrypt(encryptedUser, PIN);
        var usuario = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.authenticationService.login(usuario, false);
      })
      .catch(err => {
        console.log(err);
        alert("El PIN ingresado es incorrecto");
        this.seletedNumbers = [];
        this.errorNumberCount++;
        // si el usuario pone mal el pin 3 veces, lo mandamos al login y borramos el hash guardado
        if (this.errorNumberCount == 3) {
          this.storage.remove('user-hash');
          this.navCtrl.navigateRoot(['/login']);
        }
      });
  }

}
