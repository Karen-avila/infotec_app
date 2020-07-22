import { Component, OnInit } from '@angular/core';

declare var Authenticator: any;

@Component({
  selector: 'app-soft-token',
  templateUrl: './soft-token.page.html',
  styleUrls: ['./soft-token.page.scss'],
})
export class SoftTokenPage implements OnInit {

  key: string = 'QTCW6GSZNTHWH5BU';

  seconds: number = 30;

  dynamicToken: string;

  interval: any;

  constructor() { }

  ngOnInit() {
    this.startToken();
  }

  startToken() {

    this.interval = setInterval( async () => {
        if (this.seconds === 30) {
          this.dynamicToken = (await Authenticator.generateToken(this.key)).replace(/(\d{3})/g, '$1 ').trim();
        }
        this.seconds--;
        if (this.seconds === 0) {
          this.seconds = 30;
        }
    }, 1000 );

  }

  ionViewWillLeave() {
    clearInterval(this.interval);
  }

}
