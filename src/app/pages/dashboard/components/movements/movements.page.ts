import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ClientsService } from '@services/clients/clients.service';
import { Transaction } from '@globals/interfaces/transaction';
import { HelpersService } from '@services/helpers/helpers.service';

@Component({
  selector: 'app-nts',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})

export class MovementsPage implements OnInit {

  public movements: Transaction[];
  public flag: boolean = false;

  constructor(public modalController: ModalController, private clientsService: ClientsService, private helpersService: HelpersService, private navParams: NavParams) {
    this.initialize();
  }

  ngOnInit() {
    
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

  private initialize() {
    const { accountNumber } = this.navParams.data;

    this.helpersService.presentLoading()
    this.clientsService.getMovements(accountNumber).toPromise()
      .then(response => {
        console.log(response);
        this.movements = response.transactions.filter( item => item.transfer || item.paymentDetailData );
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        this.flag = true;
        this.helpersService.hideLoading();
      }
      )
  }
}
