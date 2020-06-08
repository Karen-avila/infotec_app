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
import { environment } from '@env';

export class accountTransferTPT {
  type: string = "tpt";
  fromOfficeId: number;
  fromClientId: number;
  fromAccountType: number;
  fromAccountId: number;

  toOfficeId: number;
  toClientId: number;
  toAccountType: number;
  toAccountId: number;

  dateFormat: string = environment.dateFormat;
  locale: string = environment.locale;
  transferDate: string;

  transferAmount: number;
  transferDescription: string;
}

export class accountTransferEXT {
  type: string = "ext";
  fromAccountId: number;
  accountNumber: string;
  dateFormat: string = environment.dateFormat;
  locale: string = environment.locale;
  note: string;
  routingCode: string;
  receiptNumber: string;
  // siempre es 2 porque es SPEI
  paymentTypeId: number = 2;
  transactionAmount: number;
  transactionDate: string;
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
  public showRFC: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public modalController: ModalController,
    public helpersService: HelpersService,
    public translate: TranslateService,
    public router: Router,
    private clientsService: ClientsService,
    private userService: UserService
  ) {
    this.transferForm = formBuilder.group({
      transferAmount: ['', Validators.required],
      transferDescription: ['', Validators.required],
      concept: [''],
      rfc: ['']
    });
    this.initialize();
  }

  ngOnInit() {
    console.log(this.helpersService.getFormattedDate());
  }


  private initialize() {
    this.flag = false;
    this.isAccountSelected = false;
    this.helpersService.presentLoading();

    Promise.all([
      this.clientsService.getBeneficiariesTPT().toPromise(),
      this.clientsService.getBeneficiariesEXT().toPromise(),

      this.clientsService.getPersonalInfo(),
      this.clientsService.getLoginInfo()
    ]
    )
      .then(async res => {
        console.log(res);
        this.savedAccounts = [...res[0], ...res[1]];
        this.userService.beneficiaries = this.savedAccounts;
        this.personalInfo = res[2];
        this.loginInfo = res[3];

        await this.getAccounts();
        return res;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.flag = true;
        this.helpersService.hideLoading();
      })
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
      this.translate.get(['Update', 'Do you want to update the bank account?']).subscribe(async translate => {
        this.helpersService
          .showAlert(translate.Update, translate['Do you want to update the bank account?'])
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
    this.translate.get(['Delete', 'Do you want to delete the beneficiary?', 'Cancel', 'Accept']).subscribe(async translate => {
      const alert = await this.alertController.create({
        header: translate['Delete'],
        message: translate['Do you want to delete the beneficiary?'],
        buttons: [
          translate['Cancel'],
          {
            text: translate['Accept'],
            handler: () => {
              this.deleteBeneficiarie(id, accountNumber, index);
            }
          }
        ]
      });

      await alert.present();
    });
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
    this.showRFC = this.accountSelected.accountNumber.length != 9 && this.accountSelected.accountNumber.length != 11;
    if (this.showRFC) { this.transferForm.controls['rfc'].setValidators(Validators.required) } else { this.transferForm.controls['rfc'].clearValidators() }
    this.transferForm.reset();
    setTimeout(() => this.content.scrollToBottom(1000), 200);
  }

  async onMakeTransfer() {
    const form = { ...this.transferForm.value };
    if (form.transferAmount > this.userService.accountMovementsSelected.accountBalance) {
      this.transferForm.controls['transferAmount'].setErrors({ transferAmountExceeded: true })
      return;
    }

    this.translate.get(['Confirm transfer', 'Do you want to confirm the transfer?', 'Cancel', 'Accept']).subscribe(async translate => {
      const alert = await this.alertController.create({
        header: translate['Confirm transfer'],
        message: translate['Do you want to confirm the transfer?'],
        buttons: [
          translate['Cancel'],
          {
            text: translate['Accept'],
            handler: () => {
              this.makeTransfer();
            }
          }
        ]
      });

      await alert.present();
    });
  }

  public makeTransfer(): void {

    console.log("Transfering...");
    const form = { ...this.transferForm.value };

    let transfer: any;
    let accountClassificaction = 'TPT' || 'EXT';
    accountClassificaction = (this.accountSelected.accountNumber.length == 9 || this.accountSelected.accountNumber.length == 11) ? 'TPT' : 'EXT';
    if (accountClassificaction == 'TPT') {
      transfer = new accountTransferTPT();
      transfer.transferDate = this.helpersService.getFormattedDate();
      transfer.locale = environment.locale;
      transfer.dateFormat = environment.dateFormat;
      transfer.fromOfficeId = this.loginInfo.officeId;
      transfer.fromClientId = this.loginInfo.clientId;
      //TODO revisar aca porque SIEMPRE es 2
      transfer.fromAccountType = this.userService.accountMovementsSelected.accountType;
      transfer.fromAccountId = this.userService.accountMovementsSelected.id;

      transfer.toOfficeId = this.accountSelected.officeId;
      transfer.toClientId = this.accountSelected.clientId;
      transfer.toAccountType = this.accountSelected.accountType.id;
      transfer.toAccountId = this.accountSelected.accountId;

      transfer.transferAmount = form.transferAmount;
      transfer.transferDescription = form.transferDescription;


    } else if (accountClassificaction == 'EXT') {
      transfer = new accountTransferEXT();

      transfer.fromAccountId = this.userService.accountMovementsSelected.id;
      transfer.accountNumber = this.accountSelected.accountNumber;
      transfer.transactionDate = this.helpersService.getFormattedDate();
      transfer.locale = environment.locale;
      transfer.dateFormat = environment.dateFormat;
      transfer.transactionAmount = form.transferAmount;
      // concepto
      transfer.note = form.concept;
      // referencia
      transfer.routingCode = form.transferDescription;
      // rfc
      transfer.receiptNumber = form.rfc;
    } else {
      return;
    }

    console.log(JSON.stringify(transfer));
    //TODO mejorar cuando sepamos que se necesita
    let transferSuccess: any = {};
    transferSuccess.accountNumber = this.accountSelected.accountNumber;
    transferSuccess.clientName = this.accountSelected.clientName ? this.accountSelected.clientName : this.accountSelected.name;
    transferSuccess.transferAmount = form.transferAmount;
    transferSuccess.referencia = form.transferDescription;

    this.clientsService.accountTransfers(transfer).toPromise()
      .then((response: any) => {
        console.log(response)
        transferSuccess.folio = response.resourceId;
        this.openSuccessModal(transferSuccess);
      })
      .catch(err => {
        console.log(err)
        this.transferForm.reset();
        this.showErrorTransactionMessage();
      })
  }

  private async showErrorTransactionMessage() {
    this.translate.get(['Transfer error', 'We could not proccess the transfer. Try later', 'Accept']).subscribe(async translate => {
      const alert = await this.alertController.create({
        header: translate['Transfer error'],
        message: translate['We could not proccess the transfer. Try later'],
        buttons: [
          translate['Accept']
        ]
      });
      await alert.present();
    });
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
      this.accountSelected = null;
      this.isAccountSelected = false;
      setTimeout(() => this.content.scrollToTop(1000), 200);
    });

    return await modal.present();
  }
  // traemos los accounts del cliente
  private async getAccounts(): Promise<any> {
    return this.clientsService.getAccounts(this.loginInfo.clientId).toPromise()
      .then((response: any) => {
        this.accounts = [];
        //TODO que este configurable el muestreo de datos de loans
        let savings = response.savingsAccounts;
        savings.forEach(element => {
          // si es savings, es 2
          if (element.status.active) {
            let account: CardAccount = new CardAccount(element.id, element.accountNo, element.accountBalance, this.personalInfo.displayName, 2);
            this.accounts.push(account);
          }
        })
        return savings;
      })
      .catch(err => {
        console.log(err)
        throw err;
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
