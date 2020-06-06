import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orden-pago',
  templateUrl: './orden-pago.page.html',
  styleUrls: ['./orden-pago.page.scss'],
})
export class OrdenPagoPage implements OnInit {

  public isCBCreated = false;
  public cbNumber = 7503007999351;
  public amount = 0.00;
  public concept = '';
  public reference = '';

  constructor() { }

  ngOnInit() {
  }

  get content(): any {
    return document.querySelector('#content') as any;
  }

  public createCB(cb: number) {
    console.log('CB created: ', cb);
    this.isCBCreated = true;
    setTimeout(() => this.content.scrollToBottom(1000), 200);
  }

}
