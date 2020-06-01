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
import { UserService } from '@services/user/user.service';
import { LoginInfo } from '@globals/interfaces/login-info';

export class AccountType {
  id: number;
  code: string;
  value: string;
}

export class BeneficiareTPT {
  id: number;
  name: string;
  officeName: string;
  clientName: string;
  accountType: AccountType;
  accountNumber: string;
  transferLimit: number;
  color: '' | 'light';
  selected: boolean;

  bankId: string = "1";
  officeId: number;
  clientId: number;
  accountId: number;
}

// export class SavedAccount {
//   id: number;
//   name: string;
//   accountNo: string;
//   officeName: string;
//   clientName: string;
//   productType: string;
//   color: '' | 'light';
//   selected: boolean;
// }

export class accountTransfer {
  fromOfficeId: number;
  fromClientId: number;
  fromAccountType: number;
  fromAccountId: number;

  toOfficeId: number;
  toClientId: number;
  toAccountType: number;
  toAccountId: number;

  dateFormat: string = "dd MMMM yyyy";
  locale: string = "es-mx";
  transferDate: string = "01 Agosto 2011";

  transferAmount: number;
  transferDescription: string;
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
  ];

  public savedAccountsTPT: BeneficiareTPT[] = [
  ]
  public savedAccountsEXT: BeneficiareTPT[] = [
  ];

  public transferForm: FormGroup;

  public isAccountSelected = false;

  public personalInfo: PersonalInfo;
  private loginInfo: LoginInfo;

  private accountSelected: BeneficiareTPT;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public modalController: ModalController,
    public helpersService: HelpersService,
    public translate: TranslateService,
    public router: Router,
    private clientsService: ClientsService,
    private storage: Storage,
    private userService: UserService
  ) {
    this.transferForm = formBuilder.group({
      transferAmount: ['', Validators.required],
      transferDescription: ['', Validators.required],
      reference: ['', Validators.required]
    });
    this.initializeApp();
  }

  ngOnInit() {
    this.getAccounts();
    this.resolveALL();
  }

  
  private initializeApp() {
    this.clientsService.getPersonalInfo()
      .then((data: PersonalInfo) => {
        this.personalInfo = data;
        console.log("personal-info", data);
        return this.clientsService.getLoginInfo();
      })
      .then((data: LoginInfo) => {
        this.loginInfo = data;
        console.log(data);
        this.getAccounts();
      });
  }

  private resolveALL() {
    Promise.all([
      this.clientsService.getBeneficiariesTPT().toPromise(),
      //TODO cambiar para que traiga beneficiares ext
      this.clientsService.getBeneficiariesTPT().toPromise()
    ]
    )
      .then(res => {
        console.log(res);

        this.savedAccountsTPT = res[0];
        this.userService.beneficiaries = res[0];
        // res[1].forEach(element => {
        //   let cuenta: SavedAccount = new SavedAccount();
        //   cuenta.id = element.id;
        //   cuenta.bankId = element.bankId;
        //   cuenta.accountNo = element.accountNumber;
        //   cuenta.owner = element.clientName;
        //   cuenta.productType = element.accountType.id.toString();
        //   this.savedAccounts.push(cuenta);
        // })

      })
      .catch(err => console.log(err));
  }

  get content(): any {
    return document.querySelector('#content') as any;
  }

  identify(index: number, item: BeneficiareTPT) {
    return item.accountNumber;
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
        this.resolveALL();
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
                ...this.savedAccountsTPT[index]
              }
            });
            modal.onDidDismiss().then(() => {
              this.resolveALL();
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

  public selectAccount(index: number, item: BeneficiareTPT) {
    console.log('Click Me', index, item);
    const prevSelected = this.savedAccountsTPT.find((account: BeneficiareTPT) => account.selected);
    if (prevSelected) {
      prevSelected.color = '';
      prevSelected.selected = false;
    }
    item.selected = true;
    item.color = 'light';
    this.accountSelected = item;
    this.isAccountSelected = true;
    setTimeout(() => this.content.scrollToBottom(1000), 200);
  }

  public makeTransfer(): void {
    console.log("Transfering...");
    const form = { ...this.transferForm.value };

    let transfer = new accountTransfer();

    transfer.fromOfficeId = this.loginInfo.officeId;
    transfer.fromClientId = this.loginInfo.clientId;
    transfer.fromAccountType = this.userService.accountMovementsSelected.accountType;
    transfer.fromAccountId = Number(this.userService.accountMovementsSelected.accountNo);
    console.log("cuenta a transferir", this.accountSelected);
    transfer.toOfficeId = this.accountSelected.officeId;
    transfer.toClientId = this.accountSelected.clientId;
    transfer.toAccountType = this.accountSelected.accountType.id;
    transfer.toAccountId = this.accountSelected.accountId ? this.accountSelected.accountId : Number(this.accountSelected.accountNumber);

    transfer.transferAmount = form.transferAmount;
    transfer.transferDescription = form.transferDescription;

    console.log(JSON.stringify(transfer));;


    this.clientsService.accountTransfers(transfer).toPromise()
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }

  // traemos los accounts del cliente
  private getAccounts(): void {
    this.storage.get('clientId')
      .then(clientId => {
        return this.clientsService.getAccounts(clientId).toPromise()
      })
      .then((response: any) => {
        this.accounts = [];
        let data = response.savingsAccounts;
        console.log("cuentas", response);
        data.forEach(element => {
          let account: CardAccount = new CardAccount(element.accountNo, element.accountBalance, this.personalInfo.displayName, element.accountType.id);
          this.accounts.push(account);
        });
      })
      .catch(err => {
        console.log(err)
      })
  }


  public deleteBeneficiarie(id): void {
    this.clientsService.deleteBeneficiarieTPT(id)
      .toPromise()
      .then((response: any) => {
        console.log(response);
      })
      .catch(err => {
        console.log(err)
      })
  }
}
