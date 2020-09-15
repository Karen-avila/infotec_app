import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-unlock-dinamic-key3',
  templateUrl: './unlock-dinamic-key3.page.html',
  styleUrls: ['./unlock-dinamic-key3.page.scss'],
})
export class UnlockDinamicKey3Page implements OnInit {

  constructor(
    protected modalController: ModalController
  ) { }

  ngOnInit() {
  }

  onAceptar() {
    this.modalController.dismiss({
      accept: false
    });
  }
}
