import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() img?: string;
  @Input() title?: string;
  @Input() menu?: boolean;
  @Input() svg?: boolean;
  @Input() backButton?: boolean;
  @Input() showNotifications?: boolean;
  @Input() defaultHref?: string;
  @Input() notifications?: string;
  @Input() dismissButton?: string;

  constructor(private modalController: ModalController,) { }

  ngOnInit() {}

  public dismissModal() {
    this.modalController.dismiss();
  }
}
