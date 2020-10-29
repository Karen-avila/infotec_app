import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CustomValidators from '@globals/custom.validator';
import { UserService } from '@services/user/user.service';
import { HelpersService } from '@services/helpers/helpers.service';
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
    private authenticationService: AuthenticationService
  ) {
    this.form = formBuilder.group({
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

      const form = { ...this.form.value };

      this.helpersService.presentLoading();

      const data = {
        shaded: true,
        password: CryptoJS.SHA256(form.newPassword).toString(CryptoJS.enc.Hex),
        repeatPassword: CryptoJS.SHA256(form.confirmPassword).toString(CryptoJS.enc.Hex)
      }

      this.userService.changeData(data)
        .toPromise()
        .then( async () => {
          await this.helpersService.showSuccessMessage('Successful change','Your password has been modified correctly');
          this.authenticationService.logout(true);
        })
        .catch( async error => {
          if (error.status === 504 || error.status === 0) {
            
          } else {
            this.helpersService.showErrorMessage();
          }
        })
        .finally( () => this.helpersService.hideLoading() );

    
  }

}
