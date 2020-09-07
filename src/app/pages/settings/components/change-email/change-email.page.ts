import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as CustomValidators from '@globals/custom.validator';
import { UserService } from '@services/user/user.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Storage } from '@ionic/storage';
import { LoginInfo } from '@globals/interfaces/login-info';
import { ClientsService } from '@services/clients/clients.service';
import { HelpersService } from '@services/helpers/helpers.service';


@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
})
export class ChangeEmailPage implements OnInit {

  form: FormGroup;

  constructor(public formBuilder: FormBuilder, private navCtrl: NavController, private userService: UserService, private storage: Storage, private clientsService: ClientsService, private helpersService: HelpersService) {

    this.form = formBuilder.group({
      shaded: true,
      email: ["", Validators.compose([
        Validators.required,
        CustomValidators.ValidateEmail
      ])]
    })
  }

  ngOnInit() {
    this.clientsService.getLoginInfo()
      .then((data: LoginInfo) => {
        this.form.patchValue({
          email: data.email
        });
      });
  }

  changeEmail() {
    const form = { ...this.form.value };
    this.helpersService.presentLoading()
    this.userService.changeData(form)
      .toPromise()
      .then( () => {
        this.updateEmail(form.email);
        this.helpersService.showSuccessMessage('Successful change', 'Your email has been modified correctly');
      })
      .catch( async error => {
        if (error.status === 504 || error.status === 0) {
          await this.helpersService.showNoInternet();
        } else if (error.error && error.error.userMessageGlobalisationCode === 'error.msg.unknown.data.integrity.issue') {
          await this.helpersService.showErrorMessage(
            'Email already exists', 
            'Please try using a different email'
          );
        } else {
          this.helpersService.showErrorMessage();
        }
      })
      .finally(() => this.helpersService.hideLoading())
  }

  private updateEmail(email: string): void {
    this.clientsService.getLoginInfo()
      .then((data: LoginInfo) => {
        data.email = email;
        this.storage.set('login-info', data);
      });
  }

}
