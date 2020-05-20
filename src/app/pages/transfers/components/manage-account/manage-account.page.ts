import { Component, OnInit, ɵConsole } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { ClientsService } from '@services/clients/clients.service';
import { Storage } from '@ionic/storage';
import { PersonalInfo } from '@globals/interfaces/personal-info';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.page.html',
  styleUrls: ['./manage-account.page.scss'],
})
export class ManageAccountPage implements OnInit {

  public type: 'Create' | 'Update';

  public formGroup: FormGroup;

  public personalInfo: PersonalInfo;

  constructor(
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected navParams: NavParams,
    protected formBuilder: FormBuilder,
    protected http: HttpClient,
    private clientsService: ClientsService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    console.log(this.navParams.data);
    const { id, type, owner, accountNo, productType, bankId, transferLimit } = this.navParams.data;

    this.type = type;

    this.formGroup = this.formBuilder.group({
      id: [''],
      accountNo: ['', Validators.required],
      owner: ['', Validators.required],
      productType: ['', Validators.required],
      bankId: ['', Validators.required],
      transferLimit: ['', Validators.required]
    });

    if (this.type === 'Create') {
      return;
    }

    this.formGroup.patchValue({
      id: id,
      accountNo: accountNo.replace(/ /gi, ''),
      owner,
      productType,
      bankId,
      transferLimit
    });
  }

  private initializeApp() {
    this.clientsService.getPersonalInfo()
      .then((data: PersonalInfo) => {
        this.personalInfo = data;
      });
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

  public getBeneficiareClientId(accountNo?: number): Observable<any> {
    let headers = new HttpHeaders({
      "authorization": "Basic " + btoa("mifos:password")
    })
    return this.http.get("https://fineract.actionfintech.net/fineract-provider/api/v1/savingsaccounts/" + accountNo, { headers: headers });
  }

  // getOfficeId(clientId?: number): Observable<any> {
  //   let headers = new HttpHeaders({
  //     "authorization": "Basic " + btoa("mifos:password")
  //   })
  //   return this.http.get("https://fineract.actionfintech.net/fineract-provider/api/v1/savingsaccounts/" + clientId, { headers: headers });
  // }

  async submit() {

    if (this.formGroup.invalid) { return }

    // TODO falta saber cual es el id del banco bienester
    // aca chequeamos que el banco a ingresar sea el bienestar
    if (this.formGroup.value.bankId == 1) {
      // aca metemos un beneficiario TPT a mifos
      let tpt = {
        "locale": "es",
        //TODO este parametro va a venir de un request que nos tiene que pasar alberto
        "name": this.formGroup.value.owner,
        //TODO este parametro va a venir de un request que nos tiene que pasar alberto
        "officeName": "Head Office",
        "accountNumber": this.formGroup.value.accountNo,
        "accountType": this.formGroup.value.productType,
        "transferLimit": this.formGroup.value.transferLimit
      }


      this.clientsService.postBeneficiariesTPT(tpt)
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

    let cuenta = {
      "name": this.formGroup.value.owner,
      "accountNumber": this.formGroup.value.accountNo,
      "accountType": this.formGroup.value.productType,
      "transferLimit": this.formGroup.value.transferLimit,
      "bankId": this.formGroup.value.bankId,
      "locale": "es"
    }

    this.clientsService.postBeneficiaries(cuenta)
      .toPromise()
      .then(res => {
        console.log(res);
        this.dismissModal();
      })
      .catch(err => {
        console.log(err);
      });
  }
}
