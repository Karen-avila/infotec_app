import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor(
    protected loadingController: LoadingController, 
    protected translate: TranslateService,
    protected alertController: AlertController
  ) { }

  public async presentLoading() {
    this.translate.get('Please wait...').subscribe( async message => {
      const loading = await this.loadingController.create({message});
        await loading.present();

        setTimeout(() => {  
          loading.dismiss();          
        }, 2000);

    } );
  }

  public async showAlert(header: string, message: string): Promise<any> {

    return new Promise( (resolve, reject) => {
      this.translate.get(['Cancel','Accept'])
        .subscribe( async (resp: any) => {
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
      } )
    })
    
  }
}
