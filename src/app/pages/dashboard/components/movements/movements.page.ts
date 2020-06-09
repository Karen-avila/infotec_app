import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientsService } from '@services/clients/clients.service';
import { UserService } from '@services/user/user.service';
import { Transaction } from '@globals/interfaces/transaction';
import { HelpersService } from '@services/helpers/helpers.service';

@Component({
  selector: 'app-nts',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})

export class MovementsPage implements OnInit {

  movements: Transaction[];
  flag: boolean = false;

  constructor(public modalController: ModalController, private clientsService: ClientsService, private userService: UserService,private helpersService: HelpersService) {
    this.initialize();
  }

  ngOnInit() {
    console.log(this.userService.accountMovementsSelected);
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

  private initialize() {
    this.helpersService.presentLoading()
    this.clientsService.getMovements(this.userService.accountMovementsSelected.accountNo).toPromise()
      .then(movimientos => {
        this.movements = movimientos.transactions;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(()=> 
      {
        this.flag = true;
        this.helpersService.hideLoading()
        }
      )
  }


}
