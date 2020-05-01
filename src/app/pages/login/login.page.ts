import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserService } from '@services/user/user.service';
import { ClientsService } from '@services/clients/clients.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  icon:boolean=true;
  type:string='password';
  loginForm: FormGroup;

  constructor(
      private router: Router, 
      public formBuilder: FormBuilder, 
      private storage: Storage,
      private userService: UserService,
      private clientsService: ClientsService
    ) { 
    this.loginForm = formBuilder.group({
      username: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(5)
      ])],
      password : ["", Validators.compose([
        Validators.required, 
        Validators.minLength(6)
      ])]
  });
  }

  ngOnInit() {
  }

  signIn(){
   
    const form = {...this.loginForm.value};

    this.storage.remove('token');

    this.userService.login(form)
      .toPromise()
      .then( login => {
        console.log(login.base64EncodedAuthenticationKey);
        
        return this.storage.set('token', login.base64EncodedAuthenticationKey)
          .then( () => {
            console.log('<here>');
            return this.clientsService.getClient('1').toPromise();
            
          } );
      } )
      .then( client => {
        this.storage.set('personal-info', client);
        this.router.navigate(['/second-login', 'pin']); //second-login
      } )
      .catch( err => {
        console.log(err);
      } );
    
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
