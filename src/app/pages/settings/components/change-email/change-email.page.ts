import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as CustomValidators from '@globals/custom.validator';
import { UserService } from '@services/user/user.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
})
export class ChangeEmailPage implements OnInit {

  form: FormGroup;
 

  constructor(private router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController, private userService: UserService,private storage: Storage) { 

    this.form = formBuilder.group({
      email: ["",   Validators.compose([
        Validators.required,
        CustomValidators.ValidateEmail
      ])]
         
    
    })
  }

  ngOnInit() {


 this.storage.get('email')
 
.then(email => {

  this.form.patchValue({
   email: email
  });
  console.log(email)
})
.catch(err => {
  console.log(err)
});


  }

  changeEmail() {
    const form = { ...this.form.value };



    this.userService.changeData(form)
      .toPromise()
      .then(response => {
        console.log(response)
        this.router.navigate(['/dashboard'])
      })
      .catch(err => {
        console.log(err)
      })
  }

}
