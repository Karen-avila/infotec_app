import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '@services/user/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  icon: boolean = true;
  type: string = 'password';
  loginForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private storage: Storage,
    private authenticationService: AuthenticationService
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
  }

  signIn() {
    console.log("INICIA LOGIN");
    const form = { ...this.loginForm.value };
    this.authenticationService.login(form);
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
