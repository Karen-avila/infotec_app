import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, AlertController, ToastController } from '@ionic/angular';
import * as CustomValidators from '@globals/custom.validator';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { ClientsService } from '@services/clients/clients.service';
import { AuthenticationService } from '@services/user/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENDPOINTS } from '@globals/endpoints';


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

  facesDetected: number = 1;

  imageUrl: string;

  registerForm: FormGroup;

  completeForm: any;

  constructor(
      private router:Router, 
      public formBuilder: FormBuilder, 
      public menuCtrl: MenuController, 
      private alertController: AlertController,
      private camera: Camera,
      private storage: Storage,
      private clientsService: ClientsService,
      private toastController: ToastController,
      private authenticationService: AuthenticationService,
      private httpClient: HttpClient
    ) { 
    this.registerForm = formBuilder.group({
      curp: ["", Validators.compose([
        Validators.required, 
        CustomValidators.ValidateCurp
      ])],
      dateOfBirth: ["", Validators.required],
      dateFormat: "yyyy-MM-dd",
      locale: "es",
      authenticationMode: "email",
      mobileNumber: ["", Validators.compose([
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

    this.imageUrl = localStorage.getItem('image');

    setTimeout(() => this.updateResults(), 200);
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

  getActivationCode(): Promise<any> {

    const form = {...this.registerForm.value};
    delete form.curp;

    return this.storage.get('registration').then( value => {
    
      this.completeForm = {...form, ...value};
      return this.clientsService.postRegistration( this.completeForm )
        .toPromise();

    } ).catch( error => {
      if (error.error && error.error.userMessageGlobalisationCode === 'error.msg.resource.not.found') {
        this.presentToast('Los datos de cliente son incorrectos, comuníquese con el área de soporte');
      }
      throw error;
    } );
  }


  register() {
    console.log("hacer peticion de registro");

    // return this.presentAlertPrompt();

    this.getActivationCode().then( resp => {
      console.log('getActivationCode', resp);
      return Promise.all([this.presentAlertPrompt(), resp]);
    } ).then( ([token, resource]) => {
      console.log(token, resource);
      
      if (token.codigoActivacion) {
        return this.clientsService.postConfirmRegistration({
            requestId: resource.resourceId,
            authenticationToken: parseInt(token.codigoActivacion)
          }).toPromise();
      }
    } ).then( (resp: any) => {
      console.log('confirm', resp);

      if (resp.resourceId) {
        this.presentToast('Usuario registrado exitosamente');
        this.storage.remove('registration');
        return resp.resourceId;
      } 
      this.presentToast('No se pudo registrar al usuario, intentelo más tarde');
      throw new Error('No se pudo registrar el usuario');
    } )
    // .then( () => {
    //   // return this.authenticationService.login({ username: this.completeForm.username, password: this.completeForm.username }, false);

    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Fineract-Platform-TenantId': 'default',
    //       'Content-Type': 'application/json'
    //     })
    //   };

    //   return this.httpClient.post(ENDPOINTS.authentication, { username: 'testingservicedos', password: this.completeForm.password }, httpOptions)
    //     .toPromise();
    // } ).then( (user: any) => {
    //   if (user.clientId) {
    //     const file = this.dataURLtoFile(this.imageUrl);
    //     return this.clientsService.postRegistrationSelfie(user.clientId, file).toPromise();
    //   }
    //   throw new Error('No se pudo registrar la selfie');
    // } )
    .then( () => {
      this.storage.set('image-profile', this.imageUrl);
      this.router.navigateByUrl('/login');
    } ).catch( error => {
      console.error(error.error.userMessageGlobalisationCode);
      if (!error.error || error.error.userMessageGlobalisationCode !== 'error.msg.resource.not.found') {
        this.presentToast('No se pudo registrar al usuario, intentelo más tarde');
      }
    } );
    //this.router.navigateByUrl('/dashboard'); //second-login
    
  }

  dataURLtoFile(dataurl, filename = 'image-profile.jpg') {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
  }

  presentAlertPrompt(): Promise<any> {

    return new Promise( async resolve => {
      const alert = await this.alertController.create({
        header: 'Solo un paso más',
        subHeader: '¡Revisa tu correo!',
        backdropDismiss: false,
        message: 'Para completar el registro, revisa tu correo, te deberá haber llegado un código de activación (si el código no te llego selecciona la opción de reenviar) que deberás proporcionar a continuación. ',
        inputs: [
          {
            name: 'codigoActivacion',
            id: 'codigoActivacion',
            type: 'number',
            placeholder: 'Código de activación'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve('cancelar')
          }, {
            text: 'Reenviar',
            handler: () => {
              this.getActivationCode();
              return false;
            }
          }, {
            text: 'Aceptar',
            handler: (alertData) => {
              if (alertData.codigoActivacion) {
                resolve({codigoActivacion: alertData.codigoActivacion});
                return; 
              }
              document.getElementById('codigoActivacion').insertAdjacentHTML('afterend', 'El código de activación es requerido');
              return false;
              
            }
          }
        ]
      });
  
      alert.present();
    } )

   
  }

  presentToast(message): boolean {
    this.toastController.create({
      message,
      duration: 5000
    }).then( toastData => {
      toastData.present();
    } );

    return false;
    
  }
}
