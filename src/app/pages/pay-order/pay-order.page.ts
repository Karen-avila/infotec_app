import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelpersService } from '@services/helpers/helpers.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { ClientsService } from '@services/clients/clients.service';
import { formatDate } from '@angular/common';
import { SavingsaccountsService } from '@services/savingsaccounts/savingsaccounts.service';
import * as CustomValidators from '@globals/custom.validator';

@Component({
  selector: 'app-pay-order',
  templateUrl: './pay-order.page.html',
  styleUrls: ['./pay-order.page.scss'],
})
export class PayOrderPage implements OnInit {

  public formGroup: FormGroup;

  cancelText: string;

  selectOption: any;

  savingsAccounts: any[];

  insufficientBalance: boolean = false;

  loadingData: boolean = false;

  constructor(
    protected formBuilder: FormBuilder, 
    protected router: Router, 
    protected helpersService: HelpersService,
    protected translate: TranslateService,
    protected alertController: AlertController,
    protected clientsService: ClientsService,
    protected savingsAccService: SavingsaccountsService
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      transactionDate: [formatDate(new Date(), 'yyyy-MM-dd', 'es-MX')],
      transactionAmount: ['',  [Validators.required, CustomValidators.ValidateInteger]],
      dateFormat: "yyyy-MM-dd",
      locale: "es",
      savingAccount: [null, [Validators.required]],
      // concept: ['', [Validators.required, Validators.minLength(5)]],
      routingCode: ['', [Validators.maxLength(5)]],
    });

    this.translate.get(['Cancel', 'My Accounts']).subscribe(translate => {
      console.log(translate);

      this.selectOption = { header: translate['My Accounts'] };
      this.cancelText = translate['Cancel'];

    });

    this.formGroup.get('transactionAmount').valueChanges.subscribe( value => {
      this.validateBalance();
    } );
    this.formGroup.get('savingAccount').valueChanges.subscribe( () => this.validateBalance() );

    this.loadingData = true;
    this.clientsService.getSavingsAccounts().then( (savings: any[]) => {
      this.savingsAccounts = savings;
      
      if (savings.length) {
        setTimeout(() => {
          this.formGroup.get('savingAccount').setValue(this.savingsAccounts[0]);
        }, 150);
      }
    } ).finally( () => this.loadingData = false );

  }

  protected validateBalance() {
    const accountBalance = (this.formGroup.get('savingAccount').value || { summary: { availableBalance: 0 } }).summary.availableBalance;
    const transactionAmount = this.formGroup.get('transactionAmount').value;

    this.insufficientBalance = transactionAmount > accountBalance;
    console.log( this.insufficientBalance ? 'saldo insuficiente' : 'saldo suficiente' )
  }

  get formControls() { 
    return this.formGroup.controls;
  }

  onPressAmount(event: any) {
    return event.key !== '.';
  }

  onPaste(event: any) {
    return false;
    
  }

  public onCancel(): void {
   
    this.translate.get([
      'Cancel', 
      'Do you want to cancel the withdrawal?'
    ]).subscribe( (resp: any) => {
      this.helpersService
        .showAlert(resp.Reject, resp['Do you want to cancel the withdrawal?'])
        .then( () => this.router.navigate(['/dashboard']) );
    } )
  }

  get canGeneratePayOrder(): boolean {
    return this.formGroup.valid && !this.insufficientBalance;
  }


  public onClick(): void {

    if (!this.canGeneratePayOrder) return;

    const formData = {...this.formGroup.value};
    const accountId = formData.savingAccount.id
    delete formData.savingAccount;

    this.translate.get([
      'Accept', 
      'The information is correct?'
    ]).subscribe( (resp: any) => {
      this.helpersService
        .showAlert(resp.Accept, resp['The information is correct?'])
        .then( () => {
          this.helpersService.presentLoading();

          this.savingsAccService.createPayOrder(accountId, formData).toPromise().then( result => {

            this.router.navigate(['pay-order', 'generate-barcode'], { queryParams: {...formData, code: result.transactionId } });
            
          } ).catch( () => {
            this.helpersService.showErrorMessage('Failed operation', 'We could not generate the Pay Order, please try again later');
          } ).finally( () => this.helpersService.hideLoading() );
        } );
    } );
  }


}
