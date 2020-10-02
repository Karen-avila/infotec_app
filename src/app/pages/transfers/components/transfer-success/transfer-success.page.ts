import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { environment } from '@env';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateService } from '@ngx-translate/core';


declare var domtoimage: any;

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
  public accountNoSelected: string;

  @ViewChild('pageShare',{static:true}) pageShare: ElementRef;

  constructor(
    protected navParams: NavParams, 
    protected socialSharing: SocialSharing,
    public modalController: ModalController,
    protected translate: TranslateService
  ) { }

  ngOnInit() {
    console.log("transfer data", this.navParams.data);

    const { accountNumber, clientName, concept, folio, reference, transferAmount, rfc, accountNoSelected } = this.navParams.data;

    this.accountNumber = accountNumber;
    this.clientName = clientName;
    this.concept = concept;
    this.folio = folio;
    this.reference = reference;
    this.transferAmount = transferAmount;
    this.rfc = rfc;
    this.accountNoSelected = accountNoSelected;

    const date = new Date();
    const formattedDate = date.toLocaleDateString(environment.locale, {
      day: '2-digit', month: 'short', year: 'numeric'
    })
    this.fecha = formattedDate;
  }

  hideAccountNumber(accountNumber: string): string {
    return '*'.repeat(accountNumber.length - 4) + accountNumber.substr(-4);
  }

  async onShare() {

    const element = this.pageShare.nativeElement;
    const scale = 600 / element.offsetWidth;
    
    domtoimage.toPng(element, {
      height: element.offsetHeight * scale,
      width: element.offsetWidth * scale,
      style: {
        transform: "scale(" + scale + ")",
        transformOrigin: "top left",
        width: element.offsetWidth + "px",
        height: element.offsetHeight + "px"
      }
    })
      .then( (dataUrl) => {
          this.socialSharing.share(null, null, dataUrl);
      }).catch( (error) => {
          console.error('oops, something went wrong!', error);
      });
  }

}
