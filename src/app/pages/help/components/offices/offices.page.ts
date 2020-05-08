import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import L from "leaflet";
import { ToastController } from '@ionic/angular';


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
  myPosition: any;
  
  constructor(
      private toastCtrl: ToastController,
      private geolocation: Geolocation
    ) {
  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.center = [resp.coords.latitude, resp.coords.longitude];
      this.myPosition = {lat: resp.coords.latitude, lng: resp.coords.longitude};
    }).catch((error) => {
        this.center = [19.4284706, -99.1276627];
        console.log('Error getting location', error);
    });
  }

  ionViewDidEnter() {
    
    this.initMap();

    this.officeIcon = this.setMapMarkerSettings('assets/icon/marker-red.svg');

    this.myPositionIcon = this.setMapMarkerSettings('assets/icon/marker-blue.svg');

    // this.map.on('click', (e) => { this.onMapClick(e) });

    this.setMapMarker(16.75383713516979, -93.11639160471047, this.officeIcon);

    this.setMapMarker(16.746818104879836, -93.07713625937892, this.officeIcon);

    if (!this.myPosition) {
      return;
    }

    this.setMapMarker(this.myPosition.lat, this.myPosition.lng, this.myPositionIcon);

    this.mensaje('Visitanos en la sucursal más cercana a tí.');
  
  }
 
  showMarkerMenu() {
    this.mensaje("Se ha pulsado click en un marcador puesto.");
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
  
  // onMapClick(e) {
  //   console.log(e.latlng);
  //   let tempMarker = L.marker(e.latlng, { icon: this.officeIcon })
  //   .on('click', this.showMarkerMenu, this)  // Al hacer click, ejecutamos this.showMarkerMenu y le pasamos el contexto (this)
  //   .addTo(this.map);
    
  //   this.mensaje("Pulsada la coordenada: " + e.latlng);
  
  // }
  
  initMap() {
  
    this.map = L.map('map', {
      center: this.center,
      zoom: 13
    });
    
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; Código 200'
    })
    .addTo(this.map);
 
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
