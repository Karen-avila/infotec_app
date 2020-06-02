import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import * as CustomValidators from '@globals/custom.validator';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';


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
      public menuCtrl: MenuController,
      public storage: Storage,
      public alertController: AlertController
    ) { 
    this.registerForm = formBuilder.group({
      username: [""],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword : ["123456789", [Validators.required, Validators.minLength(8)]],
      accountNumber: ["", Validators.compose([
        Validators.required, 
        CustomValidators.ValidateAccountNumber
      ])],
      email: ["", CustomValidators.ValidateEmail],
      firstName: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(3)
      ])],
      surName: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(3)
      ])],
      lastName: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(3)
      ])]
    }, {
      validator: CustomValidators.ValidateMatch('password', 'confirmPassword')
    });
  }

  ngOnInit() {
      this.storage.get('registration').then( data => {
        this.registerForm.patchValue(data);
      } );
  }

  register() {

    const form = {...this.registerForm.value};
    delete form.confirmPassword;

    this.storage.set('registration', form).then( () => {
      this.router.navigateByUrl('/registration/tab2'); //second-login
    } );
    
  }

  hello() {
    console.log('Hello Word');
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
