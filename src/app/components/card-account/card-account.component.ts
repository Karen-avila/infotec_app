import { Component, OnInit, Input } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';


export interface ISettings {
  accountSize: string;
  balanceSize: string;
  cardWidth: string;
  spaceBetween: number;
  orientation: 'vertical'|'horizontal';
}

export interface ICardAccount {
  account: string;
  balance: string;
  clientName: string;
  cardNumber?: string;
  [prop: string]: string;
}

@Component({
  selector: 'app-card-account',
  templateUrl: './card-account.component.html',
  styleUrls: ['./card-account.component.scss'],
})
export class CardAccountComponent implements OnInit {

  @Input() tabIndexSelected = 0;

  @Input() settings: ISettings = {
    accountSize: 'x-large',
    balanceSize: 'xx-large',
    cardWidth: '86%',
    spaceBetween: 1,
    orientation: 'vertical'
  };

  @Input() accounts: ICardAccount[];

  protected array = Array;

  constructor(protected currencyPipe: CurrencyPipe) { }

  ngOnInit() {}

  get _accounts(): ICardAccount[] {
    return this.accounts.map( item => {
      let balance = this.currencyPipe.transform(item.balance);
      const len = balance.length;
      const decimals = balance.substring(len - 2, len);
      balance = balance.substring(0, len - 2);

      return ({...item, balance, decimals});
    } );
  }

  protected slideChanged(slides: IonSlides) {
    slides.getActiveIndex().then((index: number) => {
     console.log(index);
     this.tabIndexSelected = index;
    });
  }

}
