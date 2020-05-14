import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientsService } from '@services/clients/clients.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})

export class MovementsPage implements OnInit {

  movements:any[] ;

  constructor(public modalController: ModalController, private clientsService: ClientsService) { }

  ngOnInit() {

    this.clientsService.getMovements('1')
      .toPromise()
      .then(movimientos => {
        console.log(movimientos)
    this.movements=movimientos.pageItems;
      })
      .catch(err => {
        console.log(err)
      })
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

}
