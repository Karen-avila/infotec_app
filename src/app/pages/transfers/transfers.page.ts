import { Component, OnInit } from '@angular/core';
import { ISettings } from '@components/card-account/card-account.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ManageAccountPage } from './components/manage-account/manage-account.page';
import { HelpersService } from '@services/helpers/helpers.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ClientsService } from '@services/clients/clients.service';
import { Storage } from '@ionic/storage';
import { Beneficiarie } from '@globals/interfaces/beneficiarie';
import { PersonalInfo } from '@globals/interfaces/personal-info';
import { CardAccount } from '@globals/classes/card-account';
import { UserService } from '@services/user/user.service';
import { LoginInfo } from '@globals/interfaces/login-info';
import * as CustomValidators from '@globals/custom.validator';
import { TransferSuccessPage } from './components/transfer-success/transfer-success.page';

export class accountTransfer {
  fromOfficeId: number;
  fromClientId: number;
  fromAccountType: number;
  fromAccountId: number;

  toOfficeId: number;
  toClientId: number;
  toAccountType: number;
  toAccountId: number;

  //TODO cambiar porque se va a llenar desde le backend
  dateFormat: string = "dd MMMM yyyy";
  locale: string = "es-mx";
  transferDate: string = "02 Junio 2020";

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

  public savedAccounts: Beneficiarie[] = [
  ]

  public transferForm: FormGroup;

  public isAccountSelected = false;

  public personalInfo: PersonalInfo;
  private loginInfo: LoginInfo;

  private accountSelected: Beneficiarie;

  public flag: boolean = false;

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
      transferDescription: ['', Validators.required]
    });
    this.initialize();
  }

  ngOnInit() {
    console.log(this.helpersService.getFormattedDate);
  }


  private initialize() {
    this.flag = false;
    this.isAccountSelected = false;

    Promise.all([
      this.clientsService.getBeneficiariesTPT().toPromise(),
      //TODO cambiar para que traiga beneficiares ext
      this.clientsService.getBeneficiariesEXT().toPromise(),

      this.clientsService.getPersonalInfo(),
      this.clientsService.getLoginInfo()
    ]
    )
      .then(res => {
        console.log(res);
        this.savedAccounts = [...res[0], ...res[1]];
        this.userService.beneficiaries = this.savedAccounts;
        this.personalInfo = res[2];
        this.loginInfo = res[3];

        this.getAccounts();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => this.flag = true)
  }

  get content(): any {
    return document.querySelector('#content') as any;
  }

  identify(index: number, item: Beneficiarie) {
    return item.accountNumber;
  }

  async onManageAccount(index?: number) {
    console.log(index);

    if (index === undefined) {
      const modal = await this.modalController.create({
        component: ManageAccountPage,
        componentProps: {
          'type': 'Create'
        }
      });
      modal.onDidDismiss().then(() => {
        this.initialize();
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
              this.initialize();
            });
            return await modal.present();
          });
      })
    }
  }

  async onDelete(id, accountNumber, index) {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Desea eliminar la cuenta de banco?',
      buttons: [
        'Cancelar',
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Ok');
            this.deleteBeneficiarie(id, accountNumber, index);
          }
        }
      ]
    });

    await alert.present();
  }

  public selectAccount(index: number, item: Beneficiarie) {
    console.log('Click Me', index, item);
    const prevSelected = this.savedAccounts.find((account: Beneficiarie) => account.selected);
    if (prevSelected) {
      prevSelected.color = '';
      prevSelected.selected = false;
    }
    item.selected = true;
    item.color = 'light';
    this.accountSelected = item;
    this.isAccountSelected = true;
    this.transferForm.clearValidators();
    this.transferForm.setValidators([CustomValidators.ValidateTransferAmountLimit('transferAmount', this.accountSelected.transferLimit)])
    this.transferForm.reset();
    setTimeout(() => this.content.scrollToBottom(1000), 200);
  }

  public makeTransfer(): void {
    console.log("Transfering...");
    const form = { ...this.transferForm.value };

    let transfer = new accountTransfer();

    transfer.fromOfficeId = this.loginInfo.officeId;
    transfer.fromClientId = this.loginInfo.clientId;
    //TODO revisar porque viene accountType 1 para una savings account
    transfer.fromAccountType = 2//this.userService.accountMovementsSelected.accountType;
    //TODO revisar aca porque tiene que ser el accountId
    transfer.fromAccountId = Number(this.userService.accountMovementsSelected.accountNo);
    console.log("cuenta a transferir", this.accountSelected);

    transfer.toOfficeId = this.accountSelected.officeId;
    transfer.toClientId = this.accountSelected.clientId;
    transfer.toAccountType = this.accountSelected.accountType.id;
    transfer.toAccountId = this.accountSelected.accountId ? this.accountSelected.accountId : Number(this.accountSelected.accountNumber);

    transfer.transferAmount = form.transferAmount;
    transfer.transferDescription = form.transferDescription;

    //TODO mejorar cuando sepamos que se necesita
    let transferSuccess: any = {};
    transferSuccess.accountNumber = this.accountSelected.accountNumber;
    transferSuccess.clientName = this.accountSelected.clientName;
    transferSuccess.transferAmount = form.transferAmount;
    transferSuccess.referencia = form.transferDescription;

    console.log(JSON.stringify(transfer));

    this.clientsService.accountTransfers(transfer).toPromise()
      .then((response: any) => {
        console.log(response)
        transferSuccess.folio = response.resourceId
        this.openSuccessModal(transferSuccess);
      })
      .catch(err => {
        console.log(err)
      })
  }

  private async openSuccessModal(transfer: any) {
    const modal = await this.modalController.create({
      component: TransferSuccessPage,
      componentProps: {
        'type': 'Create',
        ...transfer,
      }
    });
    modal.onDidDismiss().then(() => {
      this.initialize();
    });

    return await modal.present();
  }
  // traemos los accounts del cliente
  private getAccounts(): void {
    this.storage.get('clientId')
      .then(clientId => {
        return this.clientsService.getAccounts(clientId).toPromise()
      })
      .then((response: any) => {
        this.accounts = [];
        //TODO que este configurable el muestreo de datos de loans
        let data = response.savingsAccounts;
        data.forEach(element => {
          let account: CardAccount = new CardAccount(element.accountNo, element.accountBalance, this.personalInfo.displayName, 2);
          this.accounts.push(account);
        });
      })
      .catch(err => {
        console.log(err)
      })
  }


  public deleteBeneficiarie(id, accountNumber: string, index): void {

    let accountClassificaction = 'TPT' || 'EXT';
    accountClassificaction = (accountNumber.length == 9 || accountNumber.length == 11) ? 'TPT' : 'EXT';
    let promise: any;
    if (accountClassificaction == 'TPT') {
      promise = this.clientsService.deleteBeneficiarieTPT(id)
    }
    if (accountClassificaction == 'EXT') {
      promise = this.clientsService.deleteBeneficiarieEXT(id)
    }
    promise.toPromise().then((response: any) => {
      console.log(response);
      this.savedAccounts.splice(index, 1);
    })
      .catch(err => {
        console.log(err)
      })
  }
}
