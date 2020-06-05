import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { CodesService } from '@services/catalogs/codes.service';
import { TranslateService } from '@ngx-translate/core';

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
    private codesService: CodesService,
    private translate: TranslateService
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
    this.translate.get(['Send Email', 'Message', 'Cancel', 'Subject']).subscribe( async translate => {
      const alert = await this.alertController.create({
        header: translate['Send Email'],
        inputs: [
          {
            name: 'name1',
            type: 'text',
            placeholder: translate['Subject']+'*'
          },
          // multiline input.
          {
            name: 'paragraph',
            id: 'paragraph',
            type: 'textarea',
            placeholder: translate['Message']+'*'
          }
        ],
        buttons: [
          {
            text: translate['Cancel'],
            role: 'cancel',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: translate['Send'],
            handler: () => {
              console.log('Confirm Ok');
            }
          }
        ]
      });
  
      await alert.present();
    } );
   
  }

}
