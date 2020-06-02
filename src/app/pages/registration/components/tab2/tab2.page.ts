import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import * as CustomValidators from '@globals/custom.validator';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { ClientsService } from '@services/clients/clients.service';
import { AuthenticationService } from '@services/user/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENDPOINTS } from '@globals/endpoints';
import { HelpersService } from '@services/helpers/helpers.service';


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

  completeForm: any;

  loading: any;

  waiting: boolean = false;

  registerResponse: any;

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
      public loadingController: LoadingController,
      public helpersService: HelpersService
    ) { 
    this.registerForm = formBuilder.group({
      curp: ["MASL820234HCSZPS90", Validators.compose([
        Validators.required, 
        CustomValidators.ValidateCurp
      ])],
      dateOfBirth: ["1980-04-15", Validators.required],
      dateFormat: "yyyy-MM-dd",
      locale: "es",
      authenticationMode: "email",
      mobileNumber: ["5573435678", Validators.compose([
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

    this.facesDetected  = -1;

    setTimeout(() => this.updateResults(), 100);
  }

  getFaceDetectorOptions() {
      return new faceapi.SsdMobilenetv1Options({ minConfidence: this.minConfidence })
  }

  async showLoading() {
    this.loading = await this.helpersService.loading();
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }

  async updateResults() {    
    
    const inputImgEl = document.getElementById('img-user');
    const options = this.getFaceDetectorOptions();

    const results = await faceapi.detectAllFaces(inputImgEl, options);

    this.facesDetected = results.length;

    console.log(this.facesDetected);


    // const canvas = document.getElementById('overlay');
    // faceapi.matchDimensions(canvas, inputImgEl);
    // faceapi.draw.drawDetections(canvas, faceapi.resizeResults(results, inputImgEl));
  }

  getCurrentFaceDetectionNet() {
    return faceapi.nets.ssdMobilenetv1;
  }

  takePhoto(): void {
    this.camera.getPicture(this.options).then((imageData) => {

      this.facesDetected  = -1;
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
    
      this.completeForm = {...form, ...value, username: form.mobileNumber};

      return this.clientsService.postRegistration( this.completeForm )
        .toPromise().then( registerResponse => {
          this.registerResponse = registerResponse;
          return registerResponse;
        } );

    } ).catch( error => {
      if (error.error && error.error.userMessageGlobalisationCode === 'error.msg.resource.not.found') {
        this.presentToast('Los datos de cliente son incorrectos, comuníquese con el área de soporte');
      }
      throw error;
    } );
  }


  register() {
    console.log("hacer peticion de registro");

    this.waiting = true;

    this.showLoading();

    this.getActivationCode().then( resp => {
      console.log('getActivationCode', resp);
      return Promise.all([this.presentAlertPrompt(), resp]);
    } ).then( ([token, resource]) => {
      console.log(token, resource);

      this.showLoading();
      
      if (token.codigoActivacion) {
        console.log('Its enter here');
        
        return this.clientsService.postConfirmRegistration({
            requestId: this.registerResponse.resourceId,
            authenticationToken: parseInt(token.codigoActivacion)
          }).toPromise();
      }
      throw new Error('No se pudo obtener el código de activación');
    } ).then( (resp: any) => {
      console.log('confirm', resp);

      if (resp.resourceId) {
        return resp.resourceId;
      } 
      throw new Error('No se pudo registrar el usuario');
    } ).then( () => {
      const { username, password } = this.completeForm;
      this.authenticationService.simpleLogin({ username, password })
        .toPromise()
        .then( (user: any) => {
          if (user.clientId) {

            this.presentToast('Usuario registrado exitosamente');
            this.storage.remove('registration');
        
            const file = this.dataURLtoFile(this.imageUrl);

            const formData = new FormData();
            formData.append('file', file);

            return this.clientsService.postRegistrationSelfie(user.clientId, formData, user.base64EncodedAuthenticationKey)
              .toPromise();
          }
          throw new Error('No se pudo registrar la selfie');
        } )
    }).then( () => {
      this.hideLoading();
      this.storage.set('image-profile', this.imageUrl);
      this.router.navigateByUrl('/login');
    } ).catch( error => {
      console.error(error.error.userMessageGlobalisationCode);
      this.hideLoading();
      if (!error.error || error.error.userMessageGlobalisationCode !== 'error.msg.resource.not.found') {
        this.presentToast('No se pudo registrar al usuario, intentelo más tarde');
      }
    } ).finally( () => {
      this.waiting = false;
    });
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

    this.hideLoading();

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
                console.log('se resuelve la promesa');
                
                resolve({codigoActivacion: alertData.codigoActivacion});
                return; 
              }

              if (!document.getElementById('text-error')) {
                document.getElementById('codigoActivacion')
                  .insertAdjacentHTML('afterend', '<span id="text-error">El código de activación es requerido<span>');
              }
                
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
