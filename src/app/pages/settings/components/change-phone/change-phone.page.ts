import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as CustomValidators from '@globals/custom.validator';
import { UserService } from '@services/user/user.service';
import { ClientsService } from '@services/clients/clients.service';
import { HelpersService } from '@services/helpers/helpers.service';
import { LoginInfo } from '@globals/interfaces/login-info';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.page.html',
  styleUrls: ['./change-phone.page.scss'],
})
export class ChangePhonePage implements OnInit {

  form: FormGroup;

  constructor(public formBuilder: FormBuilder,
    private userService: UserService,
    private clientsService: ClientsService,
    private helpersService: HelpersService,
    private storage: Storage
    ) {

    this.form = formBuilder.group({
      phone: ["", Validators.compose([
        Validators.required,
        CustomValidators.ValidatePhoneNumber
      ])]
    })
  }

  ngOnInit() {
    this.clientsService.getLoginInfo()
      .then((data: LoginInfo) => {
        this.form.patchValue({
          phone: data.phone
        });
      });
  }

  changePhone() {
    const form = { ...this.form.value };
    this.helpersService.presentLoading()
    this.userService.changeData(form)
      .toPromise()
      .then(() => {
        this.updatePhone(form.phone)
        this.helpersService.showSuccessMessage('Successful change', 'Your phone has been modified correctly', '/dashboard')
      })
      .catch(err => {
        console.log(err)
        this.helpersService.showErrorMessage();
      })
      .finally(() => this.helpersService.hideLoading())
  }

  private updatePhone(phone: string): void {
    this.clientsService.getLoginInfo()
      .then((data: LoginInfo) => {
        data.phone = phone;
        this.storage.set('login-info', data);
      });
  }

}
