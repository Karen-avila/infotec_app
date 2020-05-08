import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
import * as CustomValidators from '@globals/custom.validator';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  icon:boolean=true;
  reIcon:boolean=true;
  type:string='password';
  reType:string='password';
  registerForm: FormGroup;

  constructor(
      private router:Router, 
      public formBuilder: FormBuilder, 
      public menuCtrl: MenuController
    ) { 
    this.registerForm = formBuilder.group({
      username: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(5)
      ])],
      password: ["", Validators.compose([
        Validators.required, 
      ])],
      accountNumber: ["", Validators.compose([
        Validators.required, 
        Validators.pattern('[0-9]{9,9}$')
      ])],
      phoneNumber : ["", Validators.compose([
        Validators.required, 
        CustomValidators.ValidatePhoneNumber
      ])],
      confirmPassword : ["", Validators.compose([
        Validators.required, 
      ])],
      email: ["", Validators.compose([
        Validators.required, 
        CustomValidators.ValidateEmail
      ])]
    }, {
      validator: CustomValidators.ValidateMatch('password', 'confirmPassword')
    });
  }

  ngOnInit() {
  }

  register(){
    console.log("hacer peticion de registro")
    this.router.navigateByUrl('/registration/tab2'); //second-login
    // this.presentAlertPrompt();
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
