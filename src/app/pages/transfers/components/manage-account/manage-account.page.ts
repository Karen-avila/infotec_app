import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.page.html',
  styleUrls: ['./manage-account.page.scss'],
})
export class ManageAccountPage implements OnInit {

  protected type: 'Create'|'Update'; 

  protected formGroup: FormGroup;

  constructor(
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected navParams: NavParams,
    protected formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    console.log(this.navParams.data);
    const { type, owner, accountNo, bankId } = this.navParams.data;

    this.type = type;

    this.formGroup = this.formBuilder.group({
      accountNo: ['', Validators.required],
      owner: ['', Validators.required],
      productType: ['', Validators.required],
      bankId: ['', Validators.required],
    });

    if (this.type === 'Create') {
      return;
    } 

    this.formGroup.patchValue({
      accountNo: accountNo.replace(/ /gi, ''),
      owner,
      productType: 'debit',
      bankId,
    });
  }

  protected dismissModal() {
    this.modalController.dismiss();
  }

}
