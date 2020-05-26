import { Component, OnInit, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-money-format',
  templateUrl: './money-format.component.html',
  styleUrls: ['./money-format.component.scss'],
})
export class MoneyFormatComponent implements OnInit {

  @Input() amount: string;

  public decimals: string;

  constructor(protected currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    let amount = this.currencyPipe.transform(this.amount);
    const len = amount ? amount.length : 0;
    this.decimals = amount ? amount.substring(len - 2, len) : '00';
    this.amount = amount ? amount.substring(0, len - 2) : '0';
  }

}
