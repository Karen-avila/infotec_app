import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
              public menuCtrl: MenuController) {

    this.forgotForm = formBuilder.group({
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

  forgot(){
    console.log("enviar email de recuperacion")
    this.router.navigateByUrl('/home');
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
