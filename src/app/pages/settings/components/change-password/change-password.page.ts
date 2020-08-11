import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CustomValidators from '@globals/custom.validator';
import { UserService } from '@services/user/user.service';
import { HelpersService } from '@services/helpers/helpers.service';
import { ClientsService } from '@services/clients/clients.service';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '@services/user/authentication.service';

var CryptoJS = require("crypto-js");

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  form: FormGroup;
  inputTypes: any = {
    pin: {
      icon: true,
      type: 'password'
    },
    newPassword: {
      icon: true,
      type: 'password'
    },
    confirmPassword: {
      icon: true,
      type: 'password'
    },
  }

  constructor(
    private router: Router, 
    public formBuilder: FormBuilder, 
    public menuCtrl: MenuController, 
    private userService: UserService, 
    private helpersService: HelpersService,
    private storage: Storage,
    private authenticationService: AuthenticationService
  ) {
    this.form = formBuilder.group({
      pin: ["", Validators.required],
      newPassword: ["",
        Validators.compose([
          Validators.required,
          CustomValidators.ValidatePassword
        ])
      ],
      confirmPassword: ["", Validators.required]
    }, {
      validator: CustomValidators.ValidateMatch('newPassword', 'confirmPassword')
    });
  }

  ngOnInit() {
    // TODO revisar porque estaba esto, si se descomenta rompe el menu en la pagina de settings cuando volves para atras
    //  this.menuCtrl.enable(false);
    //  this.menuCtrl.swipeGesture(false);
  }


  register() {
    console.log("hacer peticion de registro")
    this.router.navigateByUrl('/dashboard'); //second-login
  }

  viewPassword(inputName: string) {
    this.inputTypes[inputName].icon = !this.inputTypes[inputName].icon;
    this.inputTypes[inputName].type = this.inputTypes[inputName].type === 'password' && 'text' || 'password';
  }

  toOnlyRegex(key: string, regex: string, uppercase: boolean = true) {
    const inputName = this.form.get(key);
    inputName.valueChanges.subscribe(value => inputName.setValue( (uppercase ? value.toUpperCase() : value).replace(new RegExp(regex, 'g'), ""), { emitEvent: false }));
  }

  async changePassword() {

    console.log('enter here');
    
    try {

      const PIN = this.form.get('pin').value;
      const encryptedUser = await this.storage.get('user-hash');
      const bytes = CryptoJS.AES.decrypt(encryptedUser, PIN);
      var usuario = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const id = (await this.storage.get('login-info')).userId;
      console.log(usuario);
      
      const form = { ...this.form.value };

      this.helpersService.presentLoading();

      const data = {
        "password": CryptoJS.SHA256(form.newPassword).toString(CryptoJS.enc.Hex),
        "repeatPassword": CryptoJS.SHA256(form.confirmPassword).toString(CryptoJS.enc.Hex)
      }

      this.userService.changeData(data)
        .toPromise()
        .then( async () => {
          await this.helpersService.showSuccessMessage('Successful change','Your password has been modified correctly');
          this.authenticationService.logout();
        })
        .catch( async error => {
          if (error.status === 504 || error.status === 0) {
            await this.helpersService.showErrorMessage(
              'No internet connection', 
              'You need to be connected to the internet, check your connection and try again'
            );
          } else {
            this.helpersService.showErrorMessage();
          }
        })
        .finally( () => this.helpersService.hideLoading() );

    } catch(error) {
      this.helpersService.showErrorMessage("Incorrect PIN", "Please verify that your PIN is correct and try again");
    }
    
  }

}
