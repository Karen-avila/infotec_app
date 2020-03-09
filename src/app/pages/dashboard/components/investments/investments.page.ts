import { Component, OnInit } from '@angular/core';
import { IAccount } from '../account/account.interface';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.page.html',
  styleUrls: [
    './investments.page.scss',
    './../../dashboard.page.scss'
  ],
})
export class InvestmentsPage implements OnInit {

  protected accounts: IAccount[] = [
    {
      title: 'Inversión creciente',
      number: '*****2442',
      description: 'Monto invertido',
      amount: '10000',
      amountTextColor: '#3880FF'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
