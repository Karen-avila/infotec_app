import { Component, OnInit, ɵConsole } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { ClientsService } from '@services/clients/clients.service';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.page.html',
  styleUrls: ['./manage-account.page.scss'],
})
export class ManageAccountPage implements OnInit {

  public type: 'Create' | 'Update';

  public formGroup: FormGroup;

  constructor(
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected navParams: NavParams,
    protected formBuilder: FormBuilder,
    protected http: HttpClient,
    private clientsService: ClientsService
  ) { }

  ngOnInit() {
    console.log(this.navParams.data);
    const { id, type, owner, accountNo, productType, bankId } = this.navParams.data;

    this.type = type;

    this.formGroup = this.formBuilder.group({
      id: [''],
      accountNo: ['', Validators.required],
      owner: ['', Validators.required],
      productType: ['', Validators.required],
      bankId: ['', Validators.required]
    });

    if (this.type === 'Create') {
      return;
    }

    this.formGroup.patchValue({
      id: id,
      accountNo: accountNo.replace(/ /gi, ''),
      owner,
      productType,
      bankId
    });
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

  getBeneficiareClientId(accountNo?: number): Observable<any> {
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

    // aca chequeamos que el banco a ingresar sea el bienestar
    if (this.formGroup.value.bankId == 1) {
      // aca metemos un beneficiario TPT a mifos
      let tpt = {
        "locale": "es",
        "name": this.formGroup.value.owner,
        "accountNumber": this.formGroup.value.accountNo,
        "accountType": this.formGroup.value.productType,
        "transferLimit": 1000000
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

  saveBeneficiarie() {

    let cuenta = {
      bankId: this.formGroup.value.bankId,
      accountNo: this.formGroup.value.accountNo,
      owner: this.formGroup.value.owner,
      productType: this.formGroup.value.productType,
      locale: "es"
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
