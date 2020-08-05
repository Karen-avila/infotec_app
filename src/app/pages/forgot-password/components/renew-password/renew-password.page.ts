import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as CustomValidators from '@globals/custom.validator';
import { HelpersService } from '@services/helpers/helpers.service';
import { UserService } from '@services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';

var CryptoJS = require("crypto-js");

@Component({
  selector: 'app-renew-password',
  templateUrl: './renew-password.page.html',
  styleUrls: ['./renew-password.page.scss'],
})
export class RenewPasswordPage implements OnInit {

  icon: boolean = true;
  reIcon: boolean = true;
  type: string = 'password';
  reType: string = 'password';
  renewForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private helpersService: HelpersService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.renewForm = this.formBuilder.group({
      shaded: [true],
      token: ["", [Validators.required]],
      password: ["", [Validators.required, CustomValidators.ValidatePassword]],
      repeatPassword: ["", [Validators.required]],
    }, {
      validator: CustomValidators.ValidateMatch('password', 'repeatPassword')
    });

    this.renewForm.get('token').setValue(this.activatedRoute.snapshot.params.token);

  }

  renew() {

    const form = { ...this.renewForm.value };
    form.password = CryptoJS.SHA256(form.password).toString(CryptoJS.enc.Hex);
    form.repeatPassword = CryptoJS.SHA256(form.repeatPassword).toString(CryptoJS.enc.Hex);

    this.helpersService.presentLoading();
    this.userService.recoverPassword(form, 'renew').toPromise().then( async() => {
      await this.helpersService.showSuccessMessage(
        'Updated password', 
        'The password was updated correctly, you can now access mobile banking with your new password'
      );

      this.router.navigate(['/login']);

    } ).catch( async error => {

      if (error.status === 504 || error.status === 0) {
        await this.helpersService.showErrorMessage(
          'No internet connection', 
          'You need to be connected to the internet, check your connection and try again'
        );
      } else {
        await this.helpersService.showErrorMessage(
          'Incorrect data', 
          'The provided authentication code is incorrect'
        );
      } 
      
    } ) .finally( () => this.helpersService.hideLoading() );

  }

  viewRePassword() {
    if (this.reIcon) {
      console.log("view repassword");
      this.reIcon = false;
      this.reType = "text";
    } else {
      console.log("not view repassword");
      this.reIcon = true;
      this.reType = "password";
    }
  }

  viewPassword() {
    if (this.icon) {
      console.log("view password");
      this.icon = false;
      this.type = "text";
    } else {
      console.log("not view password");
      this.icon = true;
      this.type = "password";
    }
  }

}
