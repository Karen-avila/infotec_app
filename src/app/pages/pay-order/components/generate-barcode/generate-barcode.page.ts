import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-generate-barcode',
  templateUrl: './generate-barcode.page.html',
  styleUrls: ['./generate-barcode.page.scss'],
})
export class GenerateBarcodePage implements OnInit {

  public transactionAmount: number;

  public routingCode: string;

  public code: string;

  public displayName: string;

  constructor(protected activatedRoute: ActivatedRoute, protected storage: Storage) { }

  ngOnInit() {
    const { transactionAmount, code, routingCode } = this.activatedRoute.snapshot.queryParams;
    this.code = code.substring(0,12);
    this.transactionAmount = transactionAmount;
    this.routingCode = routingCode;

    this.storage.get("personal-info").then( personalInfo => this.displayName = personalInfo.displayName );
  }

}
