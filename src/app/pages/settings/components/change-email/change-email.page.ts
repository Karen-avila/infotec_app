import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CustomValidators from '@globals/custom.validator';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
})
export class ChangeEmailPage implements OnInit {

  form: FormGroup;

  constructor(private router:Router, public formBuilder: FormBuilder) { 
    this.form = formBuilder.group({
      email : ["", Validators.compose([
        Validators.required, 
        CustomValidators.ValidateEmail
      ])],
    });
  }

  ngOnInit() {
  }

  register(){
    console.log("hacer peticion de registro")
    this.router.navigateByUrl('/dashboard'); //second-login
  }

}
