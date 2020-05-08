import { Component, OnInit } from '@angular/core';
import { ICardAccount, ISettings } from '@components/card-account/card-account.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ManageAccountPage } from './components/manage-account/manage-account.page';
import { HelpersService } from '@services/helpers/helpers.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';


export class SavedAccount {
  id: number;
  owner: string;
  accountNo: string;
  bankTitle: string;
  bankId: string;
  productType: string;
  color: '' | 'light';
  selected: boolean;
}

@Component({
  selector: 'app-tranfers',
  templateUrl: './transfers.page.html',
  styleUrls: ['./transfers.page.scss'],
})
export class TransfersPage implements OnInit {

  public accounts: ICardAccount[] = [
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

  public settings: ISettings = {
    accountSize: 'small',
    balanceSize: 'large',
    cardWidth: '80%',
    spaceBetween: 0,
    orientation: 'horizontal'
  };

  public savedAccounts: SavedAccount[] = [
    // {
    //   owner: 'Fernando Jimenez Santiago',
    //   accountNo: '5546 5454 3223 8922',
    //   bankTitle: 'Cuenta BBVA Bancomer',
    //   bankId: 'bbva',
    //   selected: false,
    //   color: ''
    // },
    // {
    //   owner: 'Didier Gomez Oliver',
    //   accountNo: '5546 5454 3223 8922',
    //   bankTitle: 'Cuenta HSBC',
    //   bankId: 'hsbc',
    //   selected: false,
    //   color: ''
    // },
    // {
    //   owner: 'Eduardo Moreno Palacios',
    //   accountNo: '5546 5454 3223 8922',
    //   bankTitle: 'Cuenta Banorte',
    //   bankId: 'banorte',
    //   selected: false,
    //   color: ''
    // },
    // {
    //   owner: 'Edgar Arturo Dominguez Narvaez',
    //   accountNo: '5546 5454 3223 8922',
    //   bankTitle: 'Cuenta Santander',
    //   bankId: 'santander',
    //   selected: false,
    //   color: ''
    // }
  ];

  public transferForm: FormGroup;

  public isAccountSelected = false;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public modalController: ModalController,
    public helpersService: HelpersService,
    public translate: TranslateService,
    public router: Router,
    private http: HttpClient
  ) {
    this.transferForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getBeneficiaries();
  }

  get content(): any {
    return document.querySelector('#content') as any;
  }

  identify(index: number, item: SavedAccount) {
    return item.accountNo;
  }

  public onEdit() {

  }


  async onMangeAccount(index?: number) {
    console.log(index);

    if (index === undefined) {
      const modal = await this.modalController.create({
        component: ManageAccountPage,
        componentProps: {
          'type': 'Create'
        }
      });
      modal.onDidDismiss().then(() => {
        this.getBeneficiaries();
      });
      return await modal.present();
    } else {
      this.translate.get([
        'Update',
        'Do you want to update the bank account?'
      ]).subscribe((resp: any) => {
        this.helpersService
          .showAlert(resp.Update, resp['Do you want to update the bank account?'])
          .then(async () => {
            const modal = await this.modalController.create({
              component: ManageAccountPage,
              componentProps: {
                'type': 'Update',
                ...this.savedAccounts[index]
              }
            });
            modal.onDidDismiss().then(() => {
              this.getBeneficiaries();
            });
            return await modal.present();
          });
      })
    }



  }

  async onDelete(id) {
    console.log("ID a borrar", id);
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Deséa eliminar la cuenta de banco?',
      buttons: [
        'Cancelar',
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Ok');
            this.deleteBeneficiarie(id);
          }
        }
      ]
    });

    await alert.present();
  }

  public selectAccount(index: number, item: SavedAccount) {
    console.log('Click Me', index, item);
    const prevSelected = this.savedAccounts.find((account: SavedAccount) => account.selected);
    if (prevSelected) {
      prevSelected.color = '';
      prevSelected.selected = false;
    }
    item.selected = true;
    item.color = 'light';
    this.isAccountSelected = true;
    setTimeout(() => this.content.scrollToBottom(1000), 200);
  }

  public makeTransfer(): void {

  }

  getBeneficiaries(): void {
    console.log("trae cuentas");
    let headers = new HttpHeaders({
      "authorization": "Basic " + btoa("mifos:password")
    })

    this.http.get("https://fineract.actionfintech.net/fineract-provider/api/v1/datatables/Beneficiarios/1?genericResultSet=true",
      { headers: headers }).subscribe(
        (res: any) => {
          console.log(res);
          this.savedAccounts = [];
          let data = res.data;
          data.forEach(element => {
            let cuenta: SavedAccount = new SavedAccount();
            cuenta.id = element.row[0];
            cuenta.accountNo = element.row[2];
            cuenta.owner = element.row[3];
            cuenta.productType = element.row[4];
            cuenta.bankId = element.row[5];
            this.savedAccounts.push(cuenta);
          });
        }, (err: any) => {
          console.log(err);
        }
      );
  }

  deleteBeneficiarie(id): void {
    let headers = new HttpHeaders({
      "authorization": "Basic " + btoa("mifos:password")
    })

    this.http.delete("https://fineract.actionfintech.net/fineract-provider/api/v1/datatables/Cuentas/1/" + id + "/?genericResultSet=true",
      { headers: headers }).subscribe(
        (res: any) => {
          console.log(res);
          this.getBeneficiaries();
        }, (err: any) => {
          console.log(err);
        }
      );
  }

}
