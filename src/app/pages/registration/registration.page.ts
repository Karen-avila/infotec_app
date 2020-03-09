import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  icon:boolean=true;
  reIcon:boolean=true;
  type:string='password';
  reType:string='password';
  registerForm: FormGroup;

  constructor(private router:Router, public formBuilder: FormBuilder, public menuCtrl: MenuController) { 
    this.registerForm = formBuilder.group({
      username: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(5)
      ])],
      password: ["", Validators.compose([
        Validators.required, 
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],
      name: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(5)
      ])],
      lastName : ["", Validators.compose([
        Validators.required, 
        Validators.minLength(5)
      ])],
      accountNumber: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(9),
        Validators.pattern('[0-9]')
      ])],
      phoneNumber : ["", Validators.compose([
        Validators.required, 
        Validators.minLength(10),
        Validators.pattern('[0-9]')
      ])],
      confirmPassword : ["", Validators.compose([
        Validators.required, 
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],
      email: ["", Validators.compose([
        Validators.required, 
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")
      ])]
  });
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
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
