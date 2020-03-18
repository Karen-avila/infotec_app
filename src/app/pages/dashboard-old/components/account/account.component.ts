import { Component, OnInit, Input } from '@angular/core';
import { IAccount } from './account.interface';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  @Input() data: IAccount;

  constructor() { }

  ngOnInit() {
  }

}
