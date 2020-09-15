import { Injectable } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  flagNoInternetOpen = false;

  isLoading = false;

  constructor(
    protected loadingController: LoadingController,
    protected translate: TranslateService,
    protected alertController: AlertController,
    private navCtrl: NavController
  ) { }

  async presentLoading(text?: string) {
    this.isLoading = true;
    // console.log("Presenting loading...")
    const message = text ? text : 'Please wait...';
    this.translate.get(message).subscribe(async message => {

      return await this.loadingController.create({ message
        // duration: 5000,
      }).then(a => {
        a.present().then(() => {
          // console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
    //   this.loading = await this.loadingController.create({ message });
    //   this.loading.present();
    //   console.log("Loading exists present:", this.loading);
    });
  }

  async hideLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => {}// console.log('dismissed'
    );
  }

  // public async hideLoading() {
  //   console.log("Loading exists:", this.loading);
  //   if (!this.loading) {
  //     return;
  //   }
  //   //this.loading.dismiss();
  //   return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  // }

  public async showAlert(header: string, message: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.translate.get(['Cancel', 'Accept'])
        .subscribe(async (resp: any) => {
          const alert = await this.alertController.create({
            header,
            message,
            buttons: [
              {
                text: resp.Cancel,
                handler: () => reject('Cancel')
              },
              {
                text: resp.Accept,
                handler: () => resolve('Accept')
              }
            ]
          });
          await alert.present();
        });
    });

  }

  public async showNoInternet() {
    if (this.flagNoInternetOpen) {
      return;
    }

    this.flagNoInternetOpen = true;

    this.translate.get(['Accept']).subscribe(async translate => {

      const alert = await this.alertController.create({
        cssClass: 'no-internet-class',
        backdropDismiss: false,
        buttons: translate.Accept
      }).then(async (data) => {
        console.log(data);

        const wrapper: any = document.querySelector('.alert-wrapper');

        wrapper.innerHTML = '';
        wrapper.style.borderRadius = '20px';
        wrapper.style.position = 'relative';

        const text = await this.translate.get('Close').toPromise();

        wrapper.insertAdjacentHTML('afterbegin', `
        <img style="width: 100%; height: auto;" src="./assets/sin-internet.png" alt="Sin internet">
        <ion-text style="position: absolute; top: 13%; left: 14%; width: 72%; text-transform: uppercase; text-align: center; font-weight: bold">
          ${ await this.translate.get('No internet connection').toPromise() }
        </ion-text>
        <ion-text style="position: absolute; top: 62%; left: 14%; width: 72%; text-transform: uppercase; text-align: center; font-weight: bold">
          ${ await this.translate.get('Check your connection to continue').toPromise() }
        </ion-text>
        <ion-button expand="block" id="btnClose" color="primary" style="position: absolute; top: 75%; left: 14%; width: 72%; text-transform: uppercase;">${text}</ion-button>
      `);

        document.querySelector('#btnClose').addEventListener('click', () => alert.dismiss());

        return data;

      });
      alert.onDidDismiss().then(() => this.flagNoInternetOpen = false);

      await alert.present();

    });


  }

  public async showSuccessMessage(header: string, message: string, routerLink?: string): Promise<any> {
    return this.translate.get([header, message, 'Accept']).toPromise().then(async translate => {
      const alert = await this.alertController.create({
        header: translate[header],
        message: translate[message],
        buttons: [
          {
            text: translate.Accept,
            handler: () => {
              if (routerLink) { this.navCtrl.navigateRoot([routerLink]); }
            }
          }
        ]
      });
      return await alert.present();
    });
  }

  public successMessage(header: string, message: string, routerLink?: string): Promise<any> {
    return this.translate.get([header, message, 'Accept']).toPromise().then(translate => {
      return this.alertController.create({
        header: translate[header],
        message: translate[message],
        buttons: [
          {
            text: translate.Accept,
            handler: () => {
              if (routerLink) {this.navCtrl.navigateRoot([routerLink]);}
            }
          }
        ]
      });
    });
  }

  public blockYourAccountMessage(next?: any): Promise<any> {
    return this.translate.get(['Accept']).toPromise().then(async translate => {
      const alert = await this.alertController.create({
        cssClass: 'blockYourAccountMessage',
      });
      await alert.present();
      const wrapper = document.querySelector('.blockYourAccountMessage .alert-wrapper');
      wrapper.insertAdjacentHTML('afterbegin', `
        <img style="width: 100%; height: auto;" src="./assets/blockAccount.png" alt="Sin internet">
        <ion-text
          style="position: absolute; top: 7%; left: 8%; width: 85%; text-transform: uppercase; text-align: center; font-weight: bold"
        >
          ${ await this.translate.get('Inicio de sesión bloqueado').toPromise()}
        </ion-text>
        <ion-text
          style="position: absolute; top: 32%; left: 14%; width: 72%; text-transform: uppercase; text-align: center; font-weight: bold"
        >
          ${ await this.translate.get('Recuperar!').toPromise()}
        </ion-text>
        <ion-text
          style="position: absolute; top: 42%; left: 10%; width: 80%; font-size: 95%; text-align: center; text-align: justify;"
        >
          ${ await this.translate.get('Has bloqueado tu banca móvil por 3 intentos fallidos de inicio de sesión, para desbloquear tu cuenta oprime el boton de DESBLOQUEAR y sigue los pasos del proceso de desbloqueo de tu cuentna').toPromise()}
        </ion-text>
        <ion-button
          expand="block"
          id="btnNext"
          color="primary"
          style="position: absolute; top: 73%; left: 14%; width: 72%; text-transform: uppercase;"
        >${ await this.translate.get('DESBLOQUEAR').toPromise()}
        </ion-button>
        <ion-button
          expand="block"
          id="btnClose"
          color="medium"
          style="position: absolute; top: 85%; left: 14%; width: 72%; text-transform: uppercase;"
        >${ await this.translate.get('CANCELAR').toPromise()}
        </ion-button>
      `);
      document.querySelector('#btnNext').addEventListener('click', () => alert.dismiss());
      document.querySelector('#btnNext').addEventListener('click', next[0]);
      document.querySelector('#btnClose').addEventListener('click', () => alert.dismiss());
    });
  }

  public async showErrorMessage(title?: string, text?: string): Promise<any> {
    const message = text ? text : 'Can not proccess the request right now. Try again later';
    const header = title ? title : 'Error';
    return this.translate.get([title, message, 'Accept']).toPromise().then(async translate => {
      const alert = await this.alertController.create({
        header: translate[header],
        message: translate[message],
        buttons: [
          translate.Accept
        ]
      });
      return await alert.present();
    });
  }

  public getFormattedDate(): string {
    return formatDate(new Date(), environment.dateFormat, environment.locale);
  }
}
