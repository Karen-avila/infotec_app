import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  flagNoInternetOpen: boolean = false;

  loading: any = null;

  constructor(
    protected loadingController: LoadingController,
    protected translate: TranslateService,
    protected alertController: AlertController
  ) { }

  public async presentLoading() {
    this.translate.get('Please wait...').subscribe( async message => {
      
      this.loading = await this.loadingController.create({message});
      this.loading.present();

    });
  }


  public hideLoading() {
    if (!this.loading) {
      return;
    }
    this.loading.dismiss();
    this.loading = null;
  }

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
        })
    })

  }

  public async showNoInternet() {
    if (this.flagNoInternetOpen) {
      return;
    }

    this.flagNoInternetOpen = true;

    const alert = await this.alertController.create({
      cssClass: 'no-internet-class',
      backdropDismiss: false,
      buttons: ['Aceptar']
    }).then((data) => {
      console.log(data);

      const wrapper: any = document.querySelector('.alert-wrapper');

      wrapper.innerHTML = '';

      wrapper.style.borderRadius = '20px';
      wrapper.style.position = 'relative';

      wrapper.insertAdjacentHTML('afterbegin', `
        <img style="width: 100%; height: auto;" src="./assets/sin-internet.png" alt="Sin internet">
        <ion-button expand="block" id="btnClose" color="primary" style="position: absolute; top: 75%; left: 14%; width: 72%">CERRAR</ion-button> 
      `);

      document.querySelector('#btnClose').addEventListener('click', () => alert.dismiss());

      return data;

    });

    alert.onDidDismiss().then( () => this.flagNoInternetOpen = false );

    await alert.present();

  }

  public getFormattedDate(): string {
    return formatDate(new Date(), environment.dateFormat, environment.locale);
  }
}
