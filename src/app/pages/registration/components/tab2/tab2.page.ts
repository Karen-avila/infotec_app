import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
import * as CustomValidators from '@globals/custom.validator';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  icon:boolean=true;
  reIcon:boolean=true;
  type:string='password';
  reType:string='password';
  registerForm: FormGroup;

  constructor(
      private router:Router, 
      public formBuilder: FormBuilder, 
      public menuCtrl: MenuController, 
      private alertController: AlertController
    ) { 
    this.registerForm = formBuilder.group({
      curp: ["", Validators.compose([
        Validators.required, 
        CustomValidators.ValidateCurp
      ])],
      birthdate: ["", Validators.compose([
        Validators.required, 
      ])],
    });
  }

  ngOnInit() {
    const curp = this.registerForm.get('curp');
    curp.valueChanges.subscribe( value => curp.setValue(value.toUpperCase(), {emitEvent: false}) );
  }

  register(){
    console.log("hacer peticion de registro")
    //this.router.navigateByUrl('/dashboard'); //second-login
    this.presentAlertPrompt();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Solo un paso más',
      subHeader: '¡Revisa tu correo!',
      message: 'Para completar el registro, revisa tu correo, te deberá haber llegado un código de activación (sí el código no te llego selecciona la opción de reenviar) que deberás proporcionar a continuación. ',
      inputs: [
        {
          name: 'codigoActivacion',
          type: 'text',
          placeholder: 'Código de activación'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Reenviar',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }
}
