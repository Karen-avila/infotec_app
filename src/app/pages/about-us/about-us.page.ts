import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  public versionNumber: string = '1.0';

  constructor(private appVersion: AppVersion) { }

  ngOnInit() {
    this.appVersion.getVersionNumber().then(value => this.versionNumber = value );
  }

}
