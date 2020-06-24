import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pay-orders',
  templateUrl: './pay-orders.page.html',
  styleUrls: ['./pay-orders.page.scss'],
})
export class PayOrdersPage implements OnInit {

  selectOption: any;

  cancelText: string;

  payOrderStatus: number = 0;

  payOrdersTypes: any[] = [
    {
      key: 0, 
      value: 'Todas'
    },
    {
      key: 1, 
      value: 'Pendientes'
    },
    {
      key: 1, 
      value: 'Finalizadas'
    }
  ]

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.translateService.get(['Cancel']).subscribe(translate => {
      console.log(translate);

      this.selectOption = { header: 'Estatus' };
      this.cancelText = translate['Cancel'];

    })
  }

}
