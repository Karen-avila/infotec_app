import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';
import { Storage } from '@ionic/storage';

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
    return this.httpClient.get(`${ENDPOINTS.tptBeneficiary}`);
  }

  public postBeneficiariesTPT(data: any): Observable<any> {
    return this.httpClient.post(`${ENDPOINTS.tptBeneficiary}`, data);
  }

  public putBeneficiariesTPT(data: any): Observable<any> {
    return this.httpClient.put(`${ENDPOINTS.tptBeneficiary}`, data);
  }

  public deleteBeneficiarieTPT(id: string): Observable<any> {
    return this.httpClient.delete(`${ENDPOINTS.tptBeneficiary}/${id}`);
  }
  //#endregion

  //#region beneficiaries externos
  // aca tenemos los metodos para manejar un beneficiario externo guardado en DATATABLE
  public getBeneficiarie(): Observable<any> {
    return this.httpClient.get(`https://mifos.infotec.mx/fineract-provider/api/v1/datatables/Beneficiaries/1`);
    //return this.httpClient.get(`${ENDPOINTS.beneficiary}`);
  }

  public postBeneficiaries(data: any): Observable<any> {
    return this.httpClient.post(`${ENDPOINTS.beneficiary}`, data);
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
  
  public postRegistration(data: any) {
    return this.httpClient.post(`${ENDPOINTS.registration}`, data);
  }

  public postConfirmRegistration(data: any) {
    return this.httpClient.post(`${ENDPOINTS.registration}/user`, data);
  }

  public postRegistrationSelfie(clientId: string, file: File) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };
    
    return this.httpClient.post(`${ENDPOINTS.clients}/${clientId}/images`, {file}, httpOptions);
  }
  
}
