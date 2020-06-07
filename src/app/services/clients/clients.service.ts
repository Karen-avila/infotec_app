import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private httpWithoutInterceptors: HttpClient;

  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    private handler: HttpBackend,
    private translate: TranslateService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.httpWithoutInterceptors = new HttpClient(this.handler);
  }

  public getClient(clientId: string): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.clients}/${clientId}`);
  }
  //#region beneficiaries TPT
  // aca tenemos los metodos para manejar un beneficiaro TPT (interno de mifos)
  public getBeneficiariesTPT(): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.beneficiarytpt}`);
  }

  public postBeneficiariesTPT(data: any): Observable<any> {
    return this.httpClient.post(`${ENDPOINTS.beneficiarytpt}`, data);
  }

  public putBeneficiariesTPT(data: any, id: string): Observable<any> {
    return this.httpClient.put(`${ENDPOINTS.beneficiarytpt}/${id}`, data);
  }

  public deleteBeneficiarieTPT(id: string): Observable<any> {
    return this.httpClient.delete(`${ENDPOINTS.beneficiarytpt}/${id}`);
  }
  //#endregion

  // este metodo trae los movimientos del usuario
  public getMovements(savingAccount: string): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.savingsAccountsTransactions.replace('{savingAccount}', savingAccount)}`);
  }

  // traemos los accounts del cliente
  public getAccounts(clientId: number): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.accounts.replace('{clientId}', clientId.toString())}`);
  }

  public getPersonalInfo() {
    return this.storage.get('personal-info');
  }

  public getLoginInfo() {
    return this.storage.get('login-info');
  }

  public accountTransfers(data: any) {
    return this.httpClient.post(`${ENDPOINTS.accountTransfers}`, data);
  }

  public getBanks(): Observable<any> {
    //return this.httpClient.get(`${ENDPOINTS.banks}`);
    return this.httpClient.get(`${ENDPOINTS.codesOptions}/BANKS/options`).pipe(
      map((data: any) => {
        return data.codeValues;
      })
    );
  }

  public getBeneficiaryAccountTypes(): Observable<any> {
    //return this.httpClient.get(`${ENDPOINTS.beneficiaryAccountTypes}`);
    return this.httpClient.get(`${ENDPOINTS.codesOptions}/BENEFICIARY_ACCOUNT_TYPE/options`).pipe(
      map((data: any) => {
        return data.codeValues;
      })
    );
  }

  public searchAccount(accountNumber: string) {
    return this.httpClient.get(`${ENDPOINTS.beneficiarytpt}` + "?search=" + accountNumber);
  }

  //#region beneficiaries EXT
  // aca tenemos los metodos para manejar un beneficiaro EXT (externo de mifos)
  public getBeneficiariesEXT(): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.beneficiaryext}`);
  }

  public postBeneficiariesEXT(data: any): Observable<any> {
    return this.httpClient.post(`${ENDPOINTS.beneficiaryext}`, data);
  }

  public putBeneficiariesEXT(data: any, id: string): Observable<any> {
    return this.httpClient.put(`${ENDPOINTS.beneficiaryext}/${id}`, data);
  }

  public deleteBeneficiarieEXT(id: string): Observable<any> {
    return this.httpClient.delete(`${ENDPOINTS.beneficiaryext}/${id}`);
  }
  //#endregion

  public postRegistration(data: any) {
    return this.httpClient.post(`${ENDPOINTS.registration}`, data);
  }

  public postConfirmRegistration(data: any) {
    return this.httpClient.post(`${ENDPOINTS.registration}/user`, data);
  }

  public postRegistrationSelfie(clientId: string, formData: FormData, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Fineract-Platform-TenantId': 'default',
        Authorization: `Basic ${token}`
      })
    };

    return this.httpWithoutInterceptors.post(`${ENDPOINTS.clients}/${clientId}/images`, formData, httpOptions);
  }
  public getSocialPrograms(): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.socialPrograms}`);
  }

  public async showSuccessMessage(text: string,routeLink:string) {
    this.translate.get(['Succes!','Your',text, 'has been modified correctly', 'Accept']).subscribe(async translate => {
      const alert = await this.alertController.create({
        header: translate['Success!'],
        message: translate['Your']+' '+translate[text]+' '+translate['has been modified correctly'],
        buttons: [
          {
            text: translate['Accept'],
            handler: () => {
              this.navCtrl.navigateRoot([routeLink])
            }
          }
          
        ]
      });

      await alert.present();
    });
  }

}
