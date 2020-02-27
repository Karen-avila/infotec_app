import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(public menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
  }

}
