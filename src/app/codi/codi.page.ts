import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';

@Component({
  selector: 'app-codi',
  templateUrl: './codi.page.html',
  styleUrls: ['./codi.page.scss'],
})
export class CodiPage implements OnInit {

  codiForm: FormGroup;
  //-----------------
  qrData = "Banco del Bienestar";
  scannedCode = null;
  elementType: 'url' | 'canvas' | 'img' = 'canvas';
  //-----------------

  constructor(public formBuilder: FormBuilder, 
              private barcodeScanner: BarcodeScanner, 
            /**/  private base64ToGallery: Base64ToGallery) { 

    this.codiForm = formBuilder.group({
      payment: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(9),
        Validators.pattern('[0-9]')
      ])],
      concept: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],
      reference: ["", Validators.compose([
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])]
  });

  }

  ngOnInit() {

  }

  
  createQr(){
   /* this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,"Hola Mundo").then((data)=>{
      alert(JSON.stringify(data));
    },(err)=>{
      alert(JSON.stringify(err));
    }) */
    this.qrData = this.codiForm.controls["payment"].value + 
    this.codiForm.controls["concept"].value +
    this.codiForm.controls["reference"].value
  }
/*
  //scan test
  scanCode() {
    this.barcodeScanner.scan()
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            alert(error);
        });
}
*/
scanCode(){
  this.barcodeScanner.scan()
        .then((result) => {
            console.log(result);
            this.scannedCode = result;
        })
        .catch((error) => {
            alert(error);
        });

}

downloadQr(){

}

}
