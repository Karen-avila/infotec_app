import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelpersService } from '@services/helpers/helpers.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pay-order',
  templateUrl: './pay-order.page.html',
  styleUrls: ['./pay-order.page.scss'],
})
export class PayOrderPage implements OnInit {

  public formGroup: FormGroup;

  constructor(
    protected formBuilder: FormBuilder, 
    protected router: Router, 
    protected helpersService: HelpersService,
    protected translate: TranslateService,
    protected alertController: AlertController
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      amount: ['',  [Validators.required, Validators.min(1)]],
      concept: ['', [Validators.required, Validators.minLength(5)]],
      reference: '',
    });

  }

  get formControls() { 
    return this.formGroup.controls;
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


  public onClick(): void {

    this.translate.get([
      'Accept', 
      'The information is correct?'
    ]).subscribe( (resp: any) => {
      this.helpersService
        .showAlert(resp.Accept, resp['The information is correct?'])
        .then( () => 
          this.router.navigate(['pay-order', 'generate-barcode'], { queryParams: this.formGroup.value }) 
        );
    } );
  }


}
