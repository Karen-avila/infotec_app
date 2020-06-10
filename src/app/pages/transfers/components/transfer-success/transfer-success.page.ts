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
  public concept: string;
  public folio: number;
  public reference: string;
  public transferAmount: number;
  public fecha: string;
  public rfc: string;

  constructor(protected navParams: NavParams) { }

  ngOnInit() {
    console.log("transfer data", this.navParams.data);

    const { accountNumber, clientName, concept, folio, reference, transferAmount, rfc } = this.navParams.data;

    this.accountNumber = accountNumber;
    this.clientName = clientName;
    this.concept = concept;
    this.folio = folio;
    this.reference = reference;
    this.transferAmount = transferAmount;
    this.rfc = rfc;

    const date = new Date();
    const formattedDate = date.toLocaleDateString(environment.locale, {
      day: '2-digit', month: 'short', year: 'numeric'
    })
    this.fecha = formattedDate;
  }

}
