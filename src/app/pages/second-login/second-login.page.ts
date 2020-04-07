import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-second-login',
  templateUrl: './second-login.page.html',
  styleUrls: ['./second-login.page.scss'],
})
export class SecondLoginPage implements OnInit {

  public limitSelected: number = 4;

  public seletedNumbers: number[] = [];

  public show: boolean = false;

  public pin: string = '';

  public type: 'pin'|'confirm-pin'|'login' = 'pin';

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const {type} = this.activatedRoute.snapshot.params;
    const {code} = this.activatedRoute.snapshot.queryParams;
    if (type !== 'pin' && type !== 'confirm-pin' && type !== 'login') {
      this.type = 'pin';
    } else {
      this.type = type;
    }
    this.pin = code || '';
    console.log(this.type, this.pin);
    
  }

  get lenSelectedNumbers(): number {
    return this.seletedNumbers.length;
  }

  get buttonDisabled(): boolean {
    let disabled: boolean = true;

    switch(this.type) {
      case 'pin':
        disabled = this.lenSelectedNumbers !== this.limitSelected;
        break;

      case 'confirm-pin':
        disabled = this.lenSelectedNumbers !== this.limitSelected || this.pin !== this.seletedNumbers.join('');
        break;
    }    

    return disabled;
  }

  get buttonText(): string {
    let label: string = '';

    switch(this.type) {
      case 'pin':
        label = 'Continue';
        break;

      case 'confirm-pin':
        label = 'Accept';
        break;
    }

    return label;
  }

  public add(number: number): void {
    if (this.seletedNumbers.length >= this.limitSelected) {
      return;
    }
    this.seletedNumbers.push( number );
    console.log(this.seletedNumbers);
  }

  public delete(): void {
    if (!this.seletedNumbers.length) {
      return;
    }
    this.seletedNumbers.pop();
    console.log(this.seletedNumbers);
  }

  public goToRoute(): void {
    switch(this.type) {
      case 'pin':
        this.router.navigate(['/second-login', 'confirm-pin'], { queryParams: { code: this.seletedNumbers.join('') } })
        break;

      case 'confirm-pin':
        this.router.navigate(['/dashboard']);
        break;
    }
  }

}
