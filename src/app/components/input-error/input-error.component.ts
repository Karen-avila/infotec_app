import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

enum ErrorMessages {
  required = 'This field is required',
  min = 'The minimum number is {{value}}',
  max = 'The miximum number is {{value}}',
  minlength = 'The minimum length of this field is {{value}}',
  phoneNumber = 'The phone number must contain 10 digits',
  email = 'The email format is invalid',
  mustMatch = 'Passwords do not match'
}

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss'],
})
export class InputErrorComponent implements OnInit {

  public params: any = {};

  @Input() color: string = '#EB445A';

  @Input() control: FormControl;

  constructor(protected translate: TranslateService) { }

  ngOnInit() {
    console.log('control',this.control);
    this.control.valueChanges.subscribe( () => console.log(this.control) )
  }

  get hasError(): any {
    return this.control && this.control.touched && this.control.errors;
  }

  get messageError(): string {
    if (!this.hasError) {
      return '';
    }
    const keys: string[] = Object.keys(this.control.errors);

    switch(keys[0]) {
      case 'minlength':
        this.params['value'] = this.control.errors[keys[0]]['requiredLength'];
        break;

      default: 
        this.params['value'] = this.control.errors[keys[0]][keys[0]];        
        break;
    }

    if (this.translate.getDefaultLang() === 'en' && this.params.value) {
      return ErrorMessages[keys[0]].replace(`{{value}}`, this.params.value);
    }

    return ErrorMessages[keys[0]];
    
  }

}