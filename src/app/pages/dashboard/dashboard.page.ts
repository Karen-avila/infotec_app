import { Component, OnInit } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { MovementsPage } from './components/movements/movements.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  protected tabIdex = 0;

  protected color = 'success';

  protected accounts: any = [
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
    protected modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    private androidPermissions: AndroidPermissions
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

  protected slideChanged(slides: IonSlides) {
    slides.getActiveIndex().then((index: number) => {
     console.log(index);
     this.tabIdex = index;
    });
  }

  protected scannerQRCode() {

    this.checkPermissions();

    console.log('Its here');
   
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
