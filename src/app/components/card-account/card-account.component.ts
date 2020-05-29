import { Component, OnInit, Input } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';
import { CardAccount } from '@globals/classes/card-account';
import { UserService } from '@services/user/user.service';

export interface ISettings {
  accountSize: string;
  balanceSize: string;
  cardWidth: string;
  spaceBetween: number;
  orientation: 'vertical'|'horizontal';
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
    cardWidth: '83%',
    spaceBetween: 1,
    orientation: 'vertical'
  };

  @Input() accounts: CardAccount[];

  public array = Array;

  constructor(protected currencyPipe: CurrencyPipe, private userService: UserService) { }

  ngOnInit() {
    this.userService.accountMovementsSelected = this.accounts[0];
  }

  public slideChanged(slides: IonSlides) {
    slides.getActiveIndex().then((index: number) => {
     console.log(index);
     this.userService.accountMovementsSelected = this.accounts[index];
     this.tabIndexSelected = index;
    });
  }

}
