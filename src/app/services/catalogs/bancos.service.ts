import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  constructor(private httpClient: HttpClient) { }

  public getBancos(): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.codes.replace('{catalogo}', 'bancos')}`, {
      params: { tenantIdentifier: 'default' },
    });
  }
}
