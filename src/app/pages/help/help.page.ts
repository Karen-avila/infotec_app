import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  public showAnswer(text: string): void {
    console.log('Hola Mundo');
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
