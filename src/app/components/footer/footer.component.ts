import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(private statusBar: StatusBar) { }

  ngOnInit() {
    this.statusBar.hide();
    this.statusBar.overlaysWebView(false);
  }

}
