import { Component, OnInit, ɵConsole } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    protected http: HttpClient
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
      bankId: ['', Validators.required],
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
    });
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

  submit() {
    console.log(this.formGroup);

    let cuenta = {
      Banco: this.formGroup.value.bankId,
      NdeTarjeta: this.formGroup.value.accountNo,
      NombreDelBeneficiario: this.formGroup.value.owner,
      TipoDeProducto: this.formGroup.value.productType,

      dateFormat: "dd MMMM yyyy",
      Fecha: "07 May 2020",
      locale: "en"
    }

    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      "Fineract-Platform-TenantId": "tebancamos-c9affe7f758",
      "authorization": "Basic " + btoa("mifos:password")
    })

    if (this.formGroup.invalid) {
      alert("faltan cosas");
    } else if (this.formGroup.value.id > 0) {
      let body = JSON.stringify(cuenta);
      this.http.put("https://fineract.actionfintech.net/fineract-provider/api/v1/datatables/Cuentas/1/" + this.formGroup.value.id + "?genericResultSet=true",
        body, { headers: headers }).subscribe(
          (res: any) => {
            console.log(res);
            this.dismissModal();
          }, (err: any) => {
            console.log(err);
          }
        )
    } else {
      let body = JSON.stringify(cuenta);
      this.http.post("https://fineract.actionfintech.net/fineract-provider/api/v1/datatables/Cuentas/1?genericResultSet=true",
        body, { headers: headers }).subscribe(
          (res: any) => {
            console.log(res);
            this.dismissModal();
          }, (err: any) => {
            console.log(err);
          }
        );
    }
  }
}
