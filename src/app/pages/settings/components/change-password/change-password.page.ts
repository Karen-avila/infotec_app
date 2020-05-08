import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as CustomValidators from '@globals/custom.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  icon:boolean=true;
  reIcon:boolean=true;
  type:string='password';
  reType:string='password';
  form: FormGroup;

  constructor(private router:Router, public formBuilder: FormBuilder) { 
    this.form = formBuilder.group({
      password: ["", Validators.required],
      newPassword: ["", Validators.required],
      confirmPassword : ["", Validators.required]
    }, {
      validator: CustomValidators.ValidateMatch('newPassword', 'confirmPassword')
    });
  }

  ngOnInit() {
  }

  register(){
    console.log("hacer peticion de registro")
    this.router.navigateByUrl('/dashboard'); //second-login
  }

  viewRePassword(){
    if(this.reIcon){
      console.log("view repassword");
      this.reIcon=false;
      this.reType="text";
    }else{
      console.log("not view repassword");
      this.reIcon=true;
      this.reType="password";
    }
  }

  viewPassword(){
    if(this.icon){
      console.log("view password");
      this.icon=false;
      this.type="text";
    }else{
      console.log("not view password");
      this.icon=true;
      this.type="password";
    }
  }

}
