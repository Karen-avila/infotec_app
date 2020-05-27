import { Component, OnInit } from '@angular/core';
import { ISettings } from '@components/card-account/card-account.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ManageAccountPage } from './components/manage-account/manage-account.page';
import { HelpersService } from '@services/helpers/helpers.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ClientsService } from '@services/clients/clients.service';
import { Storage } from '@ionic/storage';
import { BeneficiarieTPT } from '@globals/interfaces/beneficiarie-tpt';
import { PersonalInfo } from '@globals/interfaces/personal-info';
import { CardAccount } from '@globals/classes/card-account';

export class SavedAccount {
  id: number;
  owner: string;
  accountNo: string;
  bankTitle: string;
  bankId: string;
  productType: string;
  beneficiarieClientId?: number;
  color: '' | 'light';
  selected: boolean;
}

@Component({
  selector: 'app-tranfers',
  templateUrl: './transfers.page.html',
  styleUrls: ['./transfers.page.scss'],
})
export class TransfersPage implements OnInit {

  public settings: ISettings = {
    accountSize: 'small',
    balanceSize: 'large',
    cardWidth: '80%',
    spaceBetween: 0,
    orientation: 'horizontal'
  };

  public accounts: CardAccount[] = [
    // {
    //   account: '0009878554',
    //   balance: '8650.25',
    //   clientName: 'Leona Vicario Fernández',
    //   cardNumber: ''
    // },
    // {
    //   account: '0003893021',
    //   balance: '12400.97',
    //   clientName: 'Leona Vicario Fernández',
    //   cardNumber: ''
    // }
  ];

  public savedAccountsTPT: SavedAccount[] = [
  ]
  public savedAccounts: SavedAccount[] = [
    {
      id: 1,
      owner: "string",
      accountNo: "string",
      bankTitle: "string",
      bankId: "string",
      productType: "string",
      color: 'light',
      selected: true,
    },
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

  public personalInfo: PersonalInfo;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public modalController: ModalController,
    public helpersService: HelpersService,
    public translate: TranslateService,
    public router: Router,
    private http: HttpClient,
    private clientsService: ClientsService,
    private storage: Storage
  ) {
    this.transferForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.initializeApp();
  }

  ngOnInit() {
    this.getAccounts();
    //this.resolveALL();
  }

  public resolveALL() {
    Promise.all([
      this.clientsService.getBeneficiariesTPT().toPromise(),
      //TODO cambiar para que traiga de get beneficiaries cuando este el self service que consulta a datatable
      this.clientsService.getBeneficiariesTPT().toPromise()
      //this.clientsService.getBeneficiarie().toPromise(),
    ]
    )
      .then(res => {
        console.log(res[0]);

        res[0].forEach(element => {
          let cuenta: SavedAccount = new SavedAccount();
          cuenta.id = element.id;
          //TODO falta poner el bankId correspondiente al de bienestar
          cuenta.bankId = "1";
          cuenta.accountNo = element.accountNumber;
          cuenta.owner = element.clientName;
          cuenta.productType = element.accountType.id.toString();
          this.savedAccounts.push(cuenta);
        })

        console.log(res[1]);
        res[1].forEach(element => {
          let cuenta: SavedAccount = new SavedAccount();
          cuenta.id = element.id;
          cuenta.bankId = element.bankId;
          cuenta.accountNo = element.accountNumber;
          cuenta.owner = element.clientName;
          cuenta.productType = element.accountType.id.toString();
          this.savedAccounts.push(cuenta);
        })

      })
      .catch(err => console.log(err));
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
        this.getBeneficiariesTPT();
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
              this.getBeneficiariesTPT();
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

  private getBeneficiariesTPT(): void {
    console.log("trae beneficiarios");
    this.clientsService.getBeneficiariesTPT()
      .toPromise()
      .then(
        (response: BeneficiarieTPT[]) => {
          console.log(response);
          this.savedAccountsTPT = [];
          response.forEach(element => {
            let cuenta: SavedAccount = new SavedAccount();
            cuenta.id = element.id;
            //TODO falta poner el bankId correspondiente al de bienestar
            cuenta.bankId = "1";
            cuenta.accountNo = element.accountNumber;
            cuenta.owner = element.clientName;
            cuenta.productType = element.accountType.id.toString();
            this.savedAccounts.push(cuenta);
          })
        })
      .catch(err => {
        console.log(err)
      })
  }

  // private getBeneficiaries(): void {
  //   console.log("trae beneficiarios");
  //   this.clientsService.getBeneficiariesTPT()
  //     .toPromise().then(
  //       (response: any) => {
  //         console.log(response);
  //         this.savedAccounts = [];
  //         let data = response.data;
  //         data.forEach(element => {
  //           let cuenta: SavedAccount = new SavedAccount();
  //           cuenta.id = element.row[0];
  //           cuenta.bankId = element.row[2];
  //           cuenta.accountNo = element.row[3];
  //           cuenta.owner = element.row[4];
  //           cuenta.productType = element.row[5];
  //           this.savedAccounts.push(cuenta);
  //         })
  //       })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }

  // traemos los accounts del cliente
  private getAccounts(): void {
    this.storage.get('clientId')
      .then(clientId => {
        return this.clientsService.getAccounts(clientId).toPromise()
      })
      .then((response: any) => {
        console.log(response);
        this.accounts = [];
        let data = response.savingsAccounts;

        data.forEach(element => {
          let account: CardAccount = new CardAccount(element.accountNo, element.accountBalance, this.personalInfo.displayName, "No se que es el CARD NUMBER");
          this.accounts.push(account);
        });
      })
      .catch(err => {
        console.log(err)
      })
  }

  private initializeApp() {
    this.clientsService.getPersonalInfo()
      .then((data: PersonalInfo) => {
        this.personalInfo = data;
      });
  }

  public deleteBeneficiarie(id): void {

    this.clientsService.deleteBeneficiarieTPT(id)
      .toPromise()
      .then((response: any) => {
        console.log(response);
        this.getBeneficiariesTPT();
      })
      .catch(err => {
        console.log(err)
      })
  }
}
