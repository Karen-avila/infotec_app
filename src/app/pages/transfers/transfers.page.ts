import { Component, OnInit } from '@angular/core';
import { ICardAccount, ISettings } from '@components/card-account/card-account.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ManageAccountPage } from './components/manage-account/manage-account.page';


export interface ISavedAccount {
  owner: string;
  accountNo: string;
  bankTitle: string;
  color: ''|'light';
  selected: boolean;
}

@Component({
  selector: 'app-tranfers',
  templateUrl: './transfers.page.html',
  styleUrls: ['./transfers.page.scss'],
})
export class TransfersPage implements OnInit {

  protected accounts: ICardAccount[] = [
    {
      account: '0009878554',
      balance: '8650.25',
      clientName: 'Leona Vicario Fernández',
      cardNumber: ''
    },
    {
      account: '0003893021',
      balance: '12400.97',
      clientName: 'Leona Vicario Fernández',
      cardNumber: ''
    }
  ];

  protected settings: ISettings = {
    accountSize: 'small',
    balanceSize: 'large',
    cardWidth: '75%',
    spaceBetween: 0,
    orientation: 'horizontal'
  };

  protected savedAccounts: ISavedAccount[] = [
    {
      owner: 'Fernando Jimenez Santiago',
      accountNo: '5546 5454 3223 8922',
      bankTitle: 'Cuenta BBVA Bancomer',
      selected: false,
      color: ''
    },
    {
      owner: 'Didier Gomez Oliver',
      accountNo: '5546 5454 3223 8922',
      bankTitle: 'Cuenta HSBC',
      selected: false,
      color: ''
    },
    {
      owner: 'Eduardo Moreno Palacios',
      accountNo: '5546 5454 3223 8922',
      bankTitle: 'Cuenta Banorte',
      selected: false,
      color: ''
    },
    {
      owner: 'Edgar Arturo Dominguez Narvaez',
      accountNo: '5546 5454 3223 8922',
      bankTitle: 'Cuenta Santander',
      selected: false,
      color: ''
    },
  ];

  protected transferForm: FormGroup;

  protected isAccountSelected = false;

  constructor(
      public formBuilder: FormBuilder,
      public alertController: AlertController,
      public modalController: ModalController
    ) {
    this.transferForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  get content(): any {
    return document.querySelector('#content') as any;
  }

  identify(index: number, item: ISavedAccount) {
    return item.accountNo;
  }

  async onMangeAccount(index?: number) {
    const modal = await this.modalController.create({
      component: ManageAccountPage,
      componentProps: {
        'firstName': 'Douglas',
        'lastName': 'Adams',
        'middleInitial': 'N'
      }
    });
    return await modal.present();
  }

  async onDelete() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Deséa eliminar la cuenta de banco?',
      buttons: [
        'Cancelar',
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  protected selectAccount(index: number, item: ISavedAccount) {
    console.log('Click Me', index, item);
    const prevSelected = this.savedAccounts.find( (account: ISavedAccount) => account.selected );
    if (prevSelected) {
      prevSelected.color = '';
      prevSelected.selected = false;
    }
    item.selected = true;
    item.color = 'light';
    this.isAccountSelected = true;
    setTimeout( () => this.content.scrollToBottom(1000), 200);
  }

  protected makeTransfer(): void {

  }

}
