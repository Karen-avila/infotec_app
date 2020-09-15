import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UnlockDinamicKey3Page } from '../unlock-dinamic-key3/unlock-dinamic-key3.page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-unlock-dinamic-key2',
  templateUrl: './unlock-dinamic-key2.page.html',
  styleUrls: ['./unlock-dinamic-key2.page.scss'],
})
export class UnlockDinamicKey2Page implements OnInit {

  constructor(
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected navParams: NavParams,
    protected formBuilder: FormBuilder,
    protected http: HttpClient
  ) { }

  ngOnInit() {
  }

  async openUnlock3() {
    const modal = await this.modalController.create({
       component: UnlockDinamicKey3Page,
       cssClass: 'modal'
     });

     return await modal.present();
}

  onCancel() {
    this.modalController.dismiss({
      accept: false
    });
  }

}
