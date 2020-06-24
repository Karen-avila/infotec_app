import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as CustomValidators from '@globals/custom.validator';
import { HelpersService } from '@services/helpers/helpers.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotForm: FormGroup;

  constructor(public alertController: AlertController, 
              private router:Router, 
              public formBuilder: FormBuilder, 
              public menuCtrl: MenuController,
              private helpersService: HelpersService,
              private translate: TranslateService
            ) {

    this.forgotForm = formBuilder.group({
      phoneNumber: ["", Validators.compose([
        Validators.required,
        CustomValidators.ValidateEmail
      ])]
  });

  }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
  }

  forgot(){
    console.log("enviar email de recuperacion")
    this.router.navigateByUrl('/home');
  }

  getActivationCode() {

    console.log('Get Recovery code');
    
  }

  presentAlertPrompt(): Promise<any> {

    this.helpersService.hideLoading();
    
    return new Promise( async resolve => {

      const message = 'You should have received an recovery code (if the code did not reach you, select the forward option) that you must provide below.';
      
      const translate = await this.translate.get([
        'Just one more step', 
        'Check your cell phone!', 
        'Transfer amount greather than account balance',
        message,
        'Finish',
        'Recovery code',
        'Recovery code is required',
        'Resend',
        'Cancel',
        'Accept'
      ]).toPromise();

      const alert = await this.alertController.create({
        header: translate['Just one more step'],
        subHeader: translate['Check your cell phone!'],
        backdropDismiss: false,
        message: translate[message],
        inputs: [
          {
            name: 'codigoActivacion',
            id: 'codigoActivacion',
            type: 'number',
            placeholder: translate['Recovery code']
          }
        ],
        buttons: [
          {
            text: translate['Cancel'],
            role: 'cancel',
            handler: () => resolve('cancelar')
          }, {
            text: translate['Resend'],
            handler: () => {
              this.getActivationCode();
              return false;
            }
          }, {
            text: translate['Accept'],
            handler: (alertData) => {
              if (alertData.codigoActivacion) {
                console.log('se resuelve la promesa');
                
                resolve({codigoActivacion: alertData.codigoActivacion});
                return; 
              }

              if (!document.getElementById('text-error')) {
                document.getElementById('codigoActivacion')
                  .insertAdjacentHTML('afterend', `<span id="text-error">${translate['Recovery code is required']}<span>`);
              }
                
              return false;
              
            }
          }
        ]
      });
  
      alert.present();
    } )

   
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¡Aviso!',
      subHeader: 'Recuperación de la contraseña',
      message: 'Se ha enviado un correo con las instrucciones para la recuperación de la contraseña.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.forgot();
          }
        }
      ]
      
    });

    await alert.present();
  }

}
