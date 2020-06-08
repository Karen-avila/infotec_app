import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generate-barcode',
  templateUrl: './generate-barcode.page.html',
  styleUrls: ['./generate-barcode.page.scss'],
})
export class GenerateBarcodePage implements OnInit {

  public amount: number;

  public concept: string;

  public reference: string;

  public isCBCreated = false;

  public cbNumber = 7503007999351;

  constructor(protected activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const { amount, concept, reference } = this.activatedRoute.snapshot.queryParams;
    this.amount = amount;
    this.concept = concept;
    this.reference = reference;
  }

}
