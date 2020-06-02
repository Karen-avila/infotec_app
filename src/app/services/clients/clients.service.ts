import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';
import { Storage } from '@ionic/storage';
import { accountTransfer } from '@pages/transfers/transfers.page';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  public getClient(clientId: string): Observable<any> {
    this.storage.set('clientId', clientId);
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
  public getAccounts(clientId: string): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.accounts.replace('{clientId}', clientId)}`);
  }

  public getPersonalInfo() {
    return this.storage.get('personal-info');
  }

  public getLoginInfo() {
    return this.storage.get('login-info');
  }

  public accountTransfers(data: accountTransfer) {
    return this.httpClient.post(`${ENDPOINTS.accountTransfers}`, data);
  }

  public getBanks() {
    return this.httpClient.get(`${ENDPOINTS.banks}`);
  }

  public getBeneficiaryAccountTypes() {
    return this.httpClient.get(`${ENDPOINTS.beneficiaryAccountTypes}`);
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

  public putBeneficiariesEXT(data: any): Observable<any> {
    return this.httpClient.put(`${ENDPOINTS.beneficiaryext}`, data);
  }

  public deleteBeneficiarieEXT(id: string): Observable<any> {
    return this.httpClient.delete(`${ENDPOINTS.beneficiaryext}/${id}`);
  }
  //#endregion
}
