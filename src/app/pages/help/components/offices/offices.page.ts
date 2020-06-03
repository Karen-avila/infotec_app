import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import L from "leaflet";
import { ToastController } from '@ionic/angular';
import { OfficeService } from '@services/office/office.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-offices',
  templateUrl: './offices.page.html',
  styleUrls: ['./offices.page.scss'],
})
export class OfficesPage implements OnInit {

  map: L.Map;
  center: L.PointTuple;
  officeIcon: any;
  myPositionIcon: any;
  myPosition: {lat:number, lng:number};
  
  constructor(
      private toastCtrl: ToastController,
      private geolocation: Geolocation,
      private office: OfficeService,
      private translate: TranslateService
    ) {
  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.center = [resp.coords.latitude, resp.coords.longitude];
      this.myPosition = {lat: resp.coords.latitude, lng: resp.coords.longitude};
    }).catch( () => {
        this.center = [19.4284706, -99.1276627];
    }).finally( () => setTimeout(() => this.start(), 200) );
  }

  getNearOffices() {
    this.office.postNearOffices(this.myPosition.lat, this.myPosition.lng).toPromise().then( (offices: any[]) => {
      
      for (const key in offices) {
        this.setMapMarker(offices[key].address.latitude, offices[key].address.longitude, this.officeIcon);
      }
      
    } );
  } 

  start() {
    
    this.initMap();

    this.officeIcon = this.setMapMarkerSettings('assets/icon/icon-bank.png');

    this.myPositionIcon = this.setMapMarkerSettings('assets/icon/marker-blue.svg');

    if (this.myPosition) {
      this.getNearOffices();
    }

    if (!this.myPosition) {
      return;
    }

    this.setMapMarker(this.myPosition.lat, this.myPosition.lng, this.myPositionIcon);

    this.translate.get('Visit us at the office closest to you.')
      .subscribe( (resp: any) => this.mensaje(resp) );
  
  }

  setMapMarkerSettings(iconUrl: string): any {
    return L.icon({
      iconUrl,
      shadowUrl: '',
      iconSize: [32, 32], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [32, 32], // point of the icon which will correspond to markers location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [32, 20] // point from which the popup should open relative to the iconAnchor
    });
  }

  setMapMarker(lat: number, lng: number, icon: string): any {
    return L.marker({lat, lng}, { icon })
        .addTo(this.map);
  }
  
  initMap() {

    this.map = L.map('map', {
      center: this.center,
      zoom: 13,
      zoomControl: false
    });

    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; Código 200'
    })
      .addTo(this.map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

  }
 
  async mensaje(texto) {
    let toast = await this.toastCtrl.create({
      message: texto,
      position: 'bottom',
      duration: 6000
    });
    toast.present();
  }

}
