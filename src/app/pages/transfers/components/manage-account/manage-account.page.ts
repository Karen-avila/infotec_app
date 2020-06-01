import { Component, OnInit, ɵConsole } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClientsService } from '@services/clients/clients.service';
import { PersonalInfo } from '@globals/interfaces/personal-info';
import * as CustomValidators from '@globals/custom.validator';
import { UserService } from '@services/user/user.service';
import { BeneficiarieTPT } from '@globals/interfaces/beneficiarie-tpt';
import { BeneficiareTPT } from '@pages/transfers/transfers.page';

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

  public banks: Bank[];
  public banksToShow: Bank[];

  public searchButtonEnabled = false;
  public accountFound: BeneficiarieTPT;

  public beneficiaryAccountTypes: BeneficiaryAccountType[] = [
    {
      "id": 60040,
      "name": "CLABE",
      "position": 0,
      "score": 18,
      "description": "",
      "active": true,
      "mandatory": false
    },
    {
      "id": 60044,
      "name": "Cuenta",
      "position": 0,
      "score": 11,
      "description": "",
      "active": true,
      "mandatory": false
    },
    {
      "id": 60042,
      "name": "Tarjeta de Débito / Crédito",
      "position": 1,
      "score": 16,
      "description": "",
      "active": true,
      "mandatory": false
    }
  ];

  public beneficiaryAccountTypesToShow: BeneficiaryAccountType[];

  constructor(
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected navParams: NavParams,
    protected formBuilder: FormBuilder,
    protected http: HttpClient,
    private clientsService: ClientsService,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    //console.log(this.navParams.data);
    const { id, type, name, alias, accountNumber, accountType, bankId, transferLimit } = this.navParams.data;

    this.type = type;

    if (this.type === 'Create') {
      return;
    }

    this.form.patchValue({
      id: id,
      name: name,
      alias: alias,
      accountType: accountType,
      accountNumber: accountNumber.replace(/ /gi, ''),
      transferLimit: transferLimit,

      bankId
    });
  }



  private initializeApp() {

    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      alias: [''],
      accountType: ['', Validators.required],
      accountNumber: ['', Validators.compose([
        Validators.required,
        CustomValidators.ValidateAccountNumberBeneficiaries
      ])],
      transferLimit: ['', Validators.required],

      bankId: ['', Validators.required]
    }, {
      validator: CustomValidators.ValidateNameBeneficiary('name', this.userService.beneficiaries)
    });

    this.form.controls['accountType'].disable();
    this.form.controls['bankId'].disable();

    // Cargamos datos del usuario
    this.clientsService.getPersonalInfo()
      .then((data: PersonalInfo) => {
        this.personalInfo = data;
      });


    // Cargamos catalogo de bancos
    this.clientsService.getBanks().toPromise()
      .then((response: any) => {
        this.banks = response.codeValues;
        console.log("bancos", this.banks);
      })
      .catch(err => {
        console.log(err);
      })

    //Cargamos catalogo de beneficiary account types
    // this.clientsService.getBeneficiaryAccountTypes().toPromise()
    //   .then((response: any) => {
    //     this.beneficiaryAccountTypes = response.codeValues;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    // Si el valor cambia => configuramos las variables necesarias
    this.form.get("accountNumber").valueChanges.subscribe((x: string) => {
      this.evaluateAccountType(x);
      this.evaluateBank(x);

      this.form.controls['name'].setValue("");
      
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
    if (x.length == 11 || x.length == 18) {
      let possibleBank = x.substring(0, 3);
      const possibleBanks = this.banks.filter(u => u.name == possibleBank);
      this.searchButtonEnabled = true;
      return possibleBanks.length == 1 ? this.form.controls['bankId'].setValue(possibleBanks[0].id.toString(), { onlySelf: true }) : null;
    } else if (x.length == 16) {
      this.form.controls['bankId'].enable();
      this.searchButtonEnabled = true;
    } else {
      this.form.controls['bankId'].disable();
      this.form.controls['bankId'].reset();
      this.searchButtonEnabled = false;
    }
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

  public showBankDropdown() {
    const form = { ...this.form.value };
    return this.form.value.accountNumber.length == 9 ||
      this.form.value.accountNumber.length == 11 ||
      this.form.value.accountNumber.length == 16 ||
      this.form.value.accountNumber.length == 18;
  }

  async search() {
    const form = { ...this.form.value };
    //TODO borrar cuando las accounts number tengan 11 digitos
    let accountNumber = form.accountNumber.substring(2);
    console.log(accountNumber);
    this.clientsService.searchAccount(accountNumber)
      .toPromise()
      .then((res: BeneficiareTPT[]) => {
        console.log(res);
        return res.length == 1 ? this.form.controls['name'].setValue(res[0].clientName) :  ;
      })
      .catch(err => {
        console.log(err);
      });
  }

  async submit() {

    const form = { ...this.form.value };
    console.log("formulario", form);
    if (this.form.invalid) { return }

    // TODO falta saber cual es el id del banco bienester
    // aca chequeamos que el banco a ingresar sea el bienestar
    console.log(form.accountNumber.length);
    console.log(form);
    if (form.accountNumber.length == 9 || form.accountNumber.length == 11) {
      // aca metemos un beneficiario TPT a mifos
      let beneficiary = {
        "locale": "es",
        //TODO este parametro va a venir de un request que nos tiene que pasar alberto
        "name": form.name,
        "alias": form.alias,
        //TODO este parametro va a venir de un request que nos tiene que pasar alberto
        "officeName": "Head Office",
        "accountNumber": form.accountNumber,
        "accountType": form.accountType,
        "transferLimit": form.transferLimit
      }

      console.log(JSON.stringify(beneficiary));

      this.clientsService.postBeneficiariesTPT(beneficiary)
        .toPromise()
        .then(res => {
          console.log(res);
          this.dismissModal();
        })
        .catch(err => {
          console.log(err);
        });

    } else {
      this.saveBeneficiarie();
    }
  }

  public saveBeneficiarie() {
    const form = { ...this.form.value };

    let cuenta = {
      "name": form.name,
      "alias": form.alias,
      "accountNumber": form.accountNumber,
      "accountType": form.accountType,
      "transferLimit": form.transferLimit,
      "bankId": form.bankId,
      "locale": "es"
    }

    // this.clientsService.postBeneficiaries(cuenta)
    //   .toPromise()
    //   .then(res => {
    //     console.log(res);
    //     this.dismissModal();
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }
}
