import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientsService } from '@services/clients/clients.service';
import { UserService } from '@services/user/user.service';
import { Transaction } from '@globals/interfaces/transaction';

@Component({
  selector: 'app-nts',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})

export class MovementsPage implements OnInit {

  movements: Transaction[];

  constructor(public modalController: ModalController, private clientsService: ClientsService, private userService: UserService) {
    this.initialize();
  }

  ngOnInit() {
    console.log(this.userService.accountMovementsSelected);
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

  private initialize() {
    this.clientsService.getMovements(this.userService.accountMovementsSelected.accountNo).toPromise()
      .then(movimientos => {
        console.log("movimientos", movimientos)
        this.movements = movimientos.transactions;
        console.log(this.movements);
      })
      .catch(err => {
        console.log(err)
      })
  }


}
