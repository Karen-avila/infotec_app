import { Component, OnInit, ɵConsole } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClientsService } from '@services/clients/clients.service';
import { PersonalInfo } from '@globals/interfaces/personal-info';
import * as CustomValidators from '@globals/custom.validator';
import { UserService } from '@services/user/user.service';
import { Beneficiarie } from '@globals/interfaces/beneficiarie';
import { TranslateService } from '@ngx-translate/core';
import { HelpersService } from '@services/helpers/helpers.service';

export interface Bank {
  id: number;
  name: string;
  position: number;
  score: number;
  description: string;
  active: boolean;
  mandatory: boolean;
}

export interface BeneficiaryAccountType {
  id: number;
  name: string;
  position: number;
  score: number;
  description: string;
  active: boolean;
  mandatory: boolean;
}

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.page.html',
  styleUrls: ['./manage-account.page.scss'],
})
export class ManageAccountPage implements OnInit {

  public type: 'Create' | 'Update';

  public form: FormGroup;

  public personalInfo: PersonalInfo;

  public banks: Bank[] = [];

  public searchButtonEnabled: boolean = false;

  private officeNameFound: string;
  private accountTypeFound: number;

  public flag: boolean = false;

  public beneficiaryAccountTypes: BeneficiaryAccountType[] = [];

  public accountTypeOption: any;

  public bankIdOption: any;

  public cancelText: string;

  constructor(
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected navParams: NavParams,
    protected formBuilder: FormBuilder,
    protected http: HttpClient,
    private clientsService: ClientsService,
    private userService: UserService,
    private translateService: TranslateService,
    private helpersService: HelpersService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    console.log(this.navParams.data);
    const { type } = this.navParams.data;

    this.type = type;
  }

  private initializeApp() {

    this.translateService.get(['Kind of product', 'Bank / Institution', 'Cancel']).subscribe(translate => {
      console.log(translate);

      this.accountTypeOption = { header: translate['Kind of product'] };
      this.bankIdOption = { header: translate['Bank / Institution'] };
      this.cancelText = translate['Cancel'];

    })


    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      alias: [''],
      accountType: ['', Validators.required],
      accountNumber: ['', Validators.compose([
        Validators.required,
        // Validators.min(9),
        //TODO por algun motivo este validador anda mal
        // Validators.max(19),
        CustomValidators.ValidateAccountNumberBeneficiaries
      ])],
      transferLimit: ['', Validators.required],

      bankId: ['', Validators.required]
    }, {
      validator: CustomValidators.ValidateNameBeneficiary('name', this.userService.beneficiaries)
    });


    this.form.controls['accountType'].disable();
    this.form.controls['bankId'].disable();
    this.form.controls['name'].disable();

    this.helpersService.presentLoading();

    Promise.all([
      this.clientsService.getPersonalInfo(),
      this.clientsService.getBanks().toPromise(),
      this.clientsService.getBeneficiaryAccountTypes().toPromise()
    ])
      .then((response: any[]) => {
        // Cargamos datos del usuario
        this.personalInfo = response[0];
        // Cargamos catalogo de bancos
        this.banks = response[1];
        //Cargamos catalogo de beneficiary account types
        this.beneficiaryAccountTypes = response[2];

        const { id, name, alias, accountNumber, transferLimit, officeName, accountType, bankEntity } = this.navParams.data;

        if (this.type === 'Create') {
          return;
        }

        this.form.patchValue({
          id: id,
          name: name,
          alias: alias,
          accountNumber: accountNumber.replace(/ /gi, ''),
          transferLimit: transferLimit,
          bankId: bankEntity
        });

        this.officeNameFound = officeName;
        this.accountTypeFound = accountType.id;

        this.form.controls['name'].enable();
        this.form.controls['accountNumber'].disable();
        this.form.controls['alias'].disable();
        this.searchButtonEnabled = false;

        this.form.setValidators([CustomValidators.ValidateNameBeneficiary('name', this.userService.beneficiaries.filter(i => i.id != id))])
      })
      .catch(err => {
        console.log(err);
        this.helpersService.showErrorMessage();
      })
      .finally(() => {
        this.flag = true
        this.helpersService.hideLoading();
      })

    // Si el valor cambia => configuramos las variables necesarias
    this.form.get("accountNumber").valueChanges.subscribe((x: string) => {
      this.evaluateAccountType(x);
      this.evaluateBank(x);
    })
  }

  async evaluateAccountType(x: string) {
    // dinamismo para poner en account type en base al largo seteado en el description
    const beneficiaryAccountType = this.beneficiaryAccountTypes.filter(u => u.score == x.length && u.active);
    if (beneficiaryAccountType.length == 1) {
      this.form.controls['accountType'].setValue(beneficiaryAccountType[0].id.toString(), { onlySelf: true });
    } else {
      this.form.controls['accountType'].reset();
    }
  }

  async evaluateBank(x: string) {
    let possibleBank = x.substring(0, 3);
    const possibleBanks = this.banks.filter(u => u.name == possibleBank);
    if (x.length == 11) {
      const possibleBanks = this.banks.filter(u => u.name == '000');
      this.searchButtonEnabled = true;
      return possibleBanks.length == 1 ? this.form.controls['bankId'].setValue(possibleBanks[0].id.toString(), { onlySelf: true }) : this.form.controls['accountNumber'].setErrors({ accountNumber: true });
    } else if (x.length == 16) {
      this.form.controls['bankId'].enable();
      this.form.controls['name'].enable();
      this.searchButtonEnabled = false;
    } else if (x.length == 18) {
      this.searchButtonEnabled = false;
      this.form.controls['name'].enable();
      return possibleBanks.length == 1 ? this.form.controls['bankId'].setValue(possibleBanks[0].id.toString(), { onlySelf: true }) : this.form.controls['accountNumber'].setErrors({ accountNumber: true });
    } else {
      this.form.controls['name'].disable();
      this.form.controls['name'].reset();

      this.form.controls['bankId'].disable();
      this.form.controls['bankId'].reset();
      this.searchButtonEnabled = false;
    }
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

  toOnlyRegex(key: string, regex: string) {
    const inputName = this.form.get(key);
    inputName.valueChanges.subscribe(value => inputName.setValue( value.toUpperCase().replace(new RegExp(regex, 'g'), ""), { emitEvent: false }));
  }

  async search() {
    this.helpersService.presentLoading('Searching client...');
    const form = { ...this.form.value };
    //TODO borrar cuando las accounts number tengan 11 digitos
    // let accountNumber = form.accountNumber.substring(2);
    let accountNumber = form.accountNumber;
    this.clientsService.searchAccount(accountNumber)
      .toPromise()
      .then((res: Beneficiarie[]) => {
        console.log(res);
        if (res.length == 1) {
          this.officeNameFound = res[0].officeName;
          this.accountTypeFound = res[0].accountType.id;
          this.form.controls['name'].setValue(res[0].clientName);
          this.form.controls['name'].markAsTouched();
          this.form.controls['name'].enable();
        } else {
          this.form.controls['accountNumber'].setErrors({ accountNotFound: true })
        }
      })
      .catch(err => {
        console.log(err);
        this.helpersService.showErrorMessage();
      })
      .finally(() => this.helpersService.hideLoading())
  }

  async submit() {

    const form = { ...this.form.getRawValue() };

    if (this.form.invalid) { return }

    let accountClassificaction = 'TPT' || 'EXT';
    accountClassificaction = (form.accountNumber.length == 9 || form.accountNumber.length == 11) ? 'TPT' : 'EXT';
    let promise: any;
    let beneficiary: any;
    const message = this.type == 'Create' ? "Creating beneficiary..." : "Updating beneficiary..."
    this.helpersService.presentLoading(message);

    if (this.type == 'Create' && accountClassificaction == 'TPT') {
      // aca metemos un beneficiario TPT a mifos
      beneficiary = {
        "locale": "es",
        "name": form.name,
        "alias": form.alias,
        //TODO borrar el substring cuando admita 11 parametros
        // "accountNumber": form.accountNumber.substring(2),
        "accountNumber": form.accountNumber,
        "officeName": this.officeNameFound,
        "accountType": this.accountTypeFound,
        "transferLimit": form.transferLimit
      }

      promise = this.clientsService.postBeneficiariesTPT(beneficiary);
    }

    if (this.type == 'Update' && accountClassificaction == 'TPT') {
      beneficiary = {
        "name": form.name,
        // TODO chequear si el alias puede ser updateable
        // "alias": form.alias,
        "transferLimit": form.transferLimit
      }
      promise = this.clientsService.putBeneficiariesTPT(beneficiary, form.id);
    }

    if (this.type == 'Create' && accountClassificaction == 'EXT') {
      // aca metemos un beneficiario TPT a mifos
      beneficiary = {
        "locale": "es",
        "name": form.name,
        "alias": form.alias,
        "accountNumber": form.accountNumber,
        "bankEntity": form.bankId,
        //siempre saving
        "accountType": 2,
        "transferLimit": form.transferLimit
      }
      promise = this.clientsService.postBeneficiariesEXT(beneficiary);
    }

    if (this.type == 'Update' && accountClassificaction == 'EXT') {
      // aca metemos un beneficiario TPT a mifos
      beneficiary = {
        "name": form.name,
        // TODO chequear si el alias puede ser updateable
        //"alias": form.alias,
        "transferLimit": form.transferLimit
      }
      console.log(JSON.stringify(beneficiary));
      promise = this.clientsService.putBeneficiariesEXT(beneficiary, form.id);
    }

    promise.toPromise().then((res: any) => {
      console.log(res);
      beneficiary.id = res.resourceId;
      this.dismissModal();
    })
      .catch(err => {
        if (err.status === 504 || err.status === 0) {
          this.helpersService.showNoInternet();
        } else {
          this.helpersService.showErrorMessage();
        }
      })
      .finally(() => this.helpersService.hideLoading())
  }
}
