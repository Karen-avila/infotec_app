import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@services/user/authentication.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  icon: boolean = true;
  type: string = 'password';
  loginForm: FormGroup;
  timeLeft: number;
  disabledButtons: boolean = false;
  loginAttempts: number = 0;
  interval;

  constructor(
      public formBuilder: FormBuilder, 
      private authenticationService: AuthenticationService,
      private storage: Storage
    ) {
    this.loginForm = formBuilder.group({
      username: ["", Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])],
      password: ["", Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])]
    });
  }

  ngOnInit() {
    // this.storage.remove('timeLeft');
    this.storage.get('timeLeft').then( timeLeft => {
      if (timeLeft && timeLeft.timeLeft > 0) this.startLoginBlocker();
    } )
  }

  get timeTextTitle(): string {
    let text: string = '';
    if (!this.timeLeft) return '';

    const hours = parseInt(`${this.timeLeft / 3600}`);
    const minutes = parseInt(`${(this.timeLeft - (hours * 3600))/60}`);
    const seconds = (this.timeLeft - ((minutes * 60) + (hours * 3600)));

    text += `${hours < 10 ? '0' : ''}${hours}`;
    text += `:${minutes < 10 ? '0' : ''}${minutes}`;
    text += `:${seconds < 10 ? '0' : ''}${seconds}`;

    // if (hours) {
    //   text += `${hours} ${hours > 1 ? 'horas' : 'hora'}`;
    // }

    // if (minutes) {
    //   text += ` ${minutes} ${minutes > 1 ? 'minutos' : 'minuto'}`;
    // }

    // if (seconds) {
    //   text += ` ${seconds} ${seconds > 1 ? 'segundos' : 'segundo'}`;
    // }
    
    return `Inicio de sesión bloqueado ${text} hrs.`.trim();
  }

  async startLoginBlocker() {
    const blockingTimes = [0.5, 1, 2, 3, 10, 15, 30, 60, 180];
    let { attemptNumber, timeLeft = null } = await this.storage.get('timeLeft') || { attemptNumber: 0 };

    this.disabledButtons = true;
    // this.loginForm.get('password').setValue('', {emitEvent: false});
    this.loginForm.get('password').reset();
    this.loginForm.get('username').reset();

    if (timeLeft) {
      this.timeLeft = timeLeft;
    } else {
      let minutes = blockingTimes[attemptNumber] ? 
        blockingTimes[attemptNumber] : blockingTimes[blockingTimes.length - 1];
      this.timeLeft = minutes * 60;
      ++attemptNumber;
    }

    console.log('attemptNumber', attemptNumber);

    this.interval = setInterval( async() => {
      this.timeLeft--;
      console.log('setInterval');
      await this.storage.set('timeLeft', {
        attemptNumber: attemptNumber,
        timeLeft: this.timeLeft
      });
      if (!this.timeLeft) {
        this.disabledButtons = false;
        clearInterval(this.interval);
      }
    }, 1000);

  }

  signIn() {
    console.log("INICIA LOGIN");
    const form = { ...this.loginForm.value };
    this.authenticationService.login(form, true).catch( async err => {
      if (err.error && err.error.userMessageGlobalisationCode === 'error.msg.not.authenticated') {
        this.loginAttempts++;
        console.log(this.loginAttempts);
        
        if (this.loginAttempts >= 3 || await this.storage.get('timeLeft')) {
          this.startLoginBlocker();
        }
      }
    } );
  }

  viewPassword() {
    if (this.icon) {
      this.icon = false;
      this.type = "text";
    } else {
      this.icon = true;
      this.type = "password";
    }
  }
}
