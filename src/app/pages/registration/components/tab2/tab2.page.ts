import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
import * as CustomValidators from '@globals/custom.validator';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';


declare var faceapi;

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    allowEdit: true,
    targetWidth: 350,
    targetHeight: 350,
    correctOrientation: true,
    cameraDirection: this.camera.Direction.FRONT
  };;

  selectedFaceDetector = 'ssd_mobilenetv1'

  minConfidence: number = 0.9;

  facesDetected: number = null;

  imageUrl: string;

  registerForm: FormGroup;

  constructor(
      private router:Router, 
      public formBuilder: FormBuilder, 
      public menuCtrl: MenuController, 
      private alertController: AlertController,
      private camera: Camera
    ) { 
    this.registerForm = formBuilder.group({
      curp: ["", Validators.compose([
        Validators.required, 
        CustomValidators.ValidateCurp
      ])],
      birthdate: ["", Validators.required],
      phoneNumber: ["", Validators.compose([
        Validators.required, 
        CustomValidators.ValidatePhoneNumber
      ])],
    });
  }

  ngOnInit() {
    this.start();
  }

  async start() {
    const curp = this.registerForm.get('curp');
    curp.valueChanges.subscribe( value => curp.setValue(value.toUpperCase(), {emitEvent: false}) );

    await faceapi.nets.ssdMobilenetv1.loadFromUri('https://raw.githubusercontent.com/nestorlazcano-fintecheando/testing-face-api/master');
  }

  getFaceDetectorOptions() {
      return new faceapi.SsdMobilenetv1Options({ minConfidence: this.minConfidence })
  }

  async updateResults() {

      const inputImgEl = document.getElementById('inputImg');
      const options = this.getFaceDetectorOptions();

      const results = await faceapi.detectAllFaces(inputImgEl, options);

      this.facesDetected = results.length;

      const canvas = document.getElementById('overlay');
      faceapi.matchDimensions(canvas, inputImgEl);
      faceapi.draw.drawDetections(canvas, faceapi.resizeResults(results, inputImgEl));
  }

  getCurrentFaceDetectionNet() {
    return faceapi.nets.ssdMobilenetv1;
  }

  takePhoto(): void {
    this.camera.getPicture(this.options).then((imageData) => {

      this.imageUrl = 'data:image/jpeg;base64,' + imageData;
      setTimeout(() => this.updateResults(), 200);
      
     }, (err) => {
      this.imageUrl = null;
     });
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
