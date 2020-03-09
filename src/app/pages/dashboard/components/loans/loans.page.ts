import { Component, OnInit } from '@angular/core';
import { IAccount } from '../account/account.interface';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.page.html',
  styleUrls: [
    './loans.page.scss',
    './../../dashboard.page.scss'
  ],
})
export class LoansPage implements OnInit {

  protected accounts: IAccount[] = [
    {
      title: 'Crédito del Bienestar',
      number: '*****4553',
      description: 'Saldo actual',
      amount: '7550',
      amountTextColor: '#EB445A'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
