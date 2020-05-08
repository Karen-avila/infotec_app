import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CustomValidators from '@globals/custom.validator';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.page.html',
  styleUrls: ['./change-phone.page.scss'],
})
export class ChangePhonePage implements OnInit {

  form: FormGroup;

  constructor(private router:Router, public formBuilder: FormBuilder) { 
    this.form = formBuilder.group({
      phoneNumber : ["", Validators.compose([
        Validators.required, 
        CustomValidators.ValidatePhoneNumber
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
