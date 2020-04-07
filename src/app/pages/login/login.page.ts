import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  icon:boolean=true;
  type:string='password';
  loginForm: FormGroup;

  constructor(private router:Router, public formBuilder: FormBuilder, public menuCtrl: MenuController) { 
    this.loginForm = formBuilder.group({
      username: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(5)
      ])],
      password : ["", Validators.compose([
        Validators.required, 
        Validators.minLength(6)
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])]
  });
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
  }

  signIn(){
    console.log("Inicia sesión");
    this.router.navigate(['/second-login', 'pin']); //second-login
  }

  viewPassword(){
    if(this.icon){
      this.icon=false;
      this.type="text";
    }else{
      this.icon=true;
      this.type="password";
    }
  }

}
