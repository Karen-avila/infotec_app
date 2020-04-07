import { Component, OnInit } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { MovementsPage } from './components/movements/movements.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public tabIdex = 0;

  public color = 'success';

  public accounts: any = [
    {
      account: '0009878554',
      balance: '8650.89',
      clientName: 'Leona Vicario Fernández',
      cardNumber: ''
    },
    {
      account: '0003893021',
      balance: '12400.45',
      clientName: 'Leona Vicario Fernández',
      cardNumber: ''
    }
  ];

  constructor(
    private modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    private androidPermissions: AndroidPermissions,
    private router: Router
  ) {
    this.checkPermissions();
  }

  ngOnInit() {
    console.log('entre a dashboard.ts');
  }

  protected checkPermissions() {
    this.androidPermissions
    .checkPermission(this.androidPermissions
    .PERMISSION.WRITE_EXTERNAL_STORAGE)
    .then((result) => {
     console.log('Has permission?', result.hasPermission);
   }, (err) => {
       this.androidPermissions
         .requestPermission(this.androidPermissions
         .PERMISSION.WRITE_EXTERNAL_STORAGE);
    });
  }

  public slideChanged(slides: IonSlides) {
    slides.getActiveIndex().then((index: number) => {
     console.log(index);
     this.tabIdex = index;
    });
  }

  public scannerQRCode() {

    let payload: any;

    this.barcodeScanner.scan({
        //preferFrontCamera : true, // iOS and Android
        //showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        //torchOn: true, // Android, launch with the torch switched on (if available)
        //prompt : "Place a barcode inside the scan area", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
        //orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
        //disableAnimations : true, // iOS
        disableSuccessBeep: true // iOS and Android
    }).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      payload = JSON.stringify(barcodeData);
    }).catch(err => {
        console.log('Error', err);
        payload = JSON.stringify({error: "No se pudo leer correctamente el código"});
    }).finally( () => {
      this.router.navigate(['pay-codi', payload ]);
    });
   
  }

  async presentModal() {
    this.color = 'secondary';
    console.log('Si esta funcionando');
    const modal = await this.modalController.create({
      component: MovementsPage
    });
    return await modal.present();
  }

}
