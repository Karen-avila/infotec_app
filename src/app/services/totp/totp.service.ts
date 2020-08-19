import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';

interface Totp {
  username: string,
  password: string,
  renew?: boolean
}

interface TotpConfirm {
  username: string,
  code: string
}

@Injectable({
  providedIn: 'root'
})
export class TotpService {

  constructor(private httpClient: HttpClient) { }

  public signUp(data: Totp): Observable<any> {
    return this.httpClient.post(`${ENDPOINTS.totp}/signup`, data);
  }

  public signupConfirmSecret(data: TotpConfirm): Observable<any> {
    return this.httpClient.post(`${ENDPOINTS.totp}/signup-confirm-secret`, data);
  }

}
