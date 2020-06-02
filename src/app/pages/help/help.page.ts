import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { CodesService } from '@services/catalogs/codes.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  questions: any[] = [];

  constructor(
    private alertController: AlertController, 
    private callNumber: CallNumber,
    private codesService: CodesService
  ) { }

  ngOnInit() {
    this.codesService.getFAQS().toPromise()
      .then( questions => this.questions = questions )
  }

  public showAnswer(text: string): void {
    console.log('Hola Mundo');
  }

  public callToOffice() {
    this.callNumber.callNumber("18001010101", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Enviar Correo',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Asunto*'
        },
        // multiline input.
        {
          name: 'paragraph',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Mensaje*'
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
          text: 'Enviar',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

}
