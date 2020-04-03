import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelpersService } from '@services/helpers/helpers.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-collect-codi',
  templateUrl: './collect-codi.page.html',
  styleUrls: ['./collect-codi.page.scss'],
})
export class CollectCodiPage implements OnInit {

  protected formGroup: FormGroup;

  constructor(
    protected formBuilder: FormBuilder, 
    protected router: Router, 
    protected helpersService: HelpersService,
    protected translate: TranslateService
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

  protected onCancel(): void {
   
    this.translate.get([
      'Cancel', 
      'Do you want to cancel the collect with CoDi?'
    ]).subscribe( (resp: any) => {
      this.helpersService
        .showAlert(resp.Reject, resp['Do you want to cancel the collect with CoDi?'])
        .then( () => this.router.navigate(['/dashboard']) );
    } )
  }

  protected onClick(): void {
    if (this.formGroup.invalid) {
      return;
    }

    console.log(this.formGroup.value);

    this.translate.get([
      'Accept', 
      'The information is correct?'
    ]).subscribe( (resp: any) => {
      this.helpersService
        .showAlert(resp.Accept, resp['The information is correct?'])
        .then( () => 
          this.router.navigate(['collect-codi', 'genarate-qr'], { queryParams: this.formGroup.value }) 
        );
    } );
  }

}
