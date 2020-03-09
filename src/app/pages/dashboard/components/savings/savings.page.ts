import { Component, OnInit } from '@angular/core';
import { IAccount } from '../account/account.interface';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.page.html',
  styleUrls: [
    './savings.page.scss',
    './../../dashboard.page.scss'
  ],
})
export class SavingsPage implements OnInit {

  protected accounts: IAccount[] = [
    {
      title: 'Cuenta del Bienestar',
      number: '*****9067',
      description: 'Saldo disponible',
      amount: '28600',
      amountTextColor: '#2DD36F'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
