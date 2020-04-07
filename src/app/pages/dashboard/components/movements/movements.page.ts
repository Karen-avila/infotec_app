import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})
export class MovementsPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  public dismissModal() {
    this.modalController.dismiss();
  }

}
