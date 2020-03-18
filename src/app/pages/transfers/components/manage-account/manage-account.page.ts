import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.page.html',
  styleUrls: ['./manage-account.page.scss'],
})
export class ManageAccountPage implements OnInit {

  constructor(
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log(this.activatedRoute.snapshot);
  }

  protected dismissModal() {
    this.modalController.dismiss();
  }

}
