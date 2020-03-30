import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pay-codi',
  templateUrl: './pay-codi.page.html',
  styleUrls: ['./pay-codi.page.scss'],
})
export class PayCodiPage implements OnInit {

  protected payload: any;

  constructor(private activatedRoute: ActivatedRoute) { 
    const { payload } = this.activatedRoute.snapshot.params;
    this.payload  = JSON.parse(payload);
    console.log(this.activatedRoute.snapshot.params);
  }

  ngOnInit() {
  }

}
