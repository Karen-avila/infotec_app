import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as CustomValidators from '@globals/custom.validator';
import { UserService } from '@services/user/user.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.page.html',
  styleUrls: ['./change-phone.page.scss'],
})
export class ChangePhonePage implements OnInit {

  form: FormGroup;

  constructor(private router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController, private userService: UserService,private storage: Storage) { 

    this.form = formBuilder.group({
      phone: ["",   Validators.compose([
        Validators.required,
        CustomValidators.ValidatePhoneNumber
      ])]
    
    })
  }

  ngOnInit() {


    this.storage.get('personal-info')
 
    .then(phone => {
    
      this.form.patchValue({
       phone: phone.mobileNo
      });
    })
    .catch(err => {
      console.log(err)
    });
    

  }

  changePhone() {
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