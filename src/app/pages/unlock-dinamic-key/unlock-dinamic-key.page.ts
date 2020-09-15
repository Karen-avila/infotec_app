import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UnlockDinamicKey2Page } from './components/unlock-dinamic-key2/unlock-dinamic-key2.page';

@Component({
  selector: 'app-unlock-dinamic-key',
  templateUrl: './unlock-dinamic-key.page.html',
  styleUrls: ['./unlock-dinamic-key.page.scss'],
})
export class UnlockDinamicKeyPage implements OnInit {

  constructor(
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected navParams: NavParams,
    protected formBuilder: FormBuilder,
    protected http: HttpClient
  ) { }

  ngOnInit() {
  }

  onCancel() {
    this.modalController.dismiss({
      accept: false
    });
  }
  async openUnlock2() {
    const modal = await this.modalController.create({
       component: UnlockDinamicKey2Page,
     });

     await modal.present();
}


}

