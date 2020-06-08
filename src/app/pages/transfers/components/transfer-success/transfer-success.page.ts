import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { environment } from '@env';

@Component({
  selector: 'app-transfer-success',
  templateUrl: './transfer-success.page.html',
  styleUrls: ['./transfer-success.page.scss'],
})
export class TransferSuccessPage implements OnInit {

  public accountNumber: string;
  public clientName: string;
  public concepto: string;
  public folio: number;
  public referencia: string;
  public transferAmount: number;
  public fecha: string;

  constructor(protected navParams: NavParams) { }

  ngOnInit() {
    console.log("transfer data", this.navParams.data);

    const { accountNumber, clientName, concepto, folio, referencia, transferAmount } = this.navParams.data;

    this.accountNumber = accountNumber;
    this.clientName = clientName;
    this.concepto = concepto;
    this.folio = folio;
    this.referencia = referencia;
    this.transferAmount = transferAmount;

    const date = new Date();
    const formattedDate = date.toLocaleDateString(environment.locale, {
      day: '2-digit', month: 'short', year: 'numeric'
    })
    this.fecha = formattedDate;
  }

}
