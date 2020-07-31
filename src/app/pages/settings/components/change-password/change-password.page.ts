import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as CustomValidators from '@globals/custom.validator';
import { UserService } from '@services/user/user.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HelpersService } from '@services/helpers/helpers.service';
import { ClientsService } from '@services/clients/clients.service';



@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  icon: boolean = true;
  reIcon: boolean = true;
  type: string = 'password';
  reType: string = 'password';
  form: FormGroup;



  constructor(private router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController, private userService: UserService, private clientsService: ClientsService, private helpersService: HelpersService) {
    this.form = formBuilder.group({
      password: ["", Validators.required],
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

  changePassword() {
    const form = { ...this.form.value };
    this.helpersService.presentLoading()
    const data = {
      "password": form.newPassword,
      "repeatPassword": form.confirmPassword
    }

    this.userService.changeData(data)
      .toPromise()
      .then(response => {
        this.helpersService.showSuccessMessage('Successful change','Your password has been modified correctly', '/logout')
      })
      .catch(err => {
        console.log(err)
        this.helpersService.showErrorMessage();
      })
      .finally(() => this.helpersService.hideLoading())
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
