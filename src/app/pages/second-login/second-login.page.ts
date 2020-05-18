import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AES256 } from '@ionic-native/aes-256/ngx';

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

  public type: 'pin' | 'confirm-pin' | 'login' = 'pin';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private aes256: AES256) { }

  ngOnInit() {
    console.log(this.activatedRoute.snapshot.params);
    const { type } = this.activatedRoute.snapshot.params;
    const { code } = this.activatedRoute.snapshot.queryParams;
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

    switch (this.type) {
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

    switch (this.type) {
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
    this.seletedNumbers.push(number);
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
    switch (this.type) {
      case 'pin':
        this.router.navigate(['/second-login', 'confirm-pin'], { queryParams: { code: this.seletedNumbers.join('') } })
        break;

      case 'confirm-pin':
        this.encryptPIN();
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  private secureKey: string;
  private secureIV: string;

  private async encryptPIN() {
    const PIN = this.seletedNumbers.join('');
    this.secureKey = await this.aes256.generateSecureKey(PIN); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV(PIN); // Returns a 16 bytes string

    const { usuario } = this.activatedRoute.snapshot.params;
    const { password } = this.activatedRoute.snapshot.params;
    const user = { usuario : usuario, password: password};
    const userString = JSON.stringify(user);

    this.aes256.encrypt(this.secureKey, this.secureIV, userString)
      .then(res => alert(res))
      .catch((error: any) => alert(error));
  }


}
