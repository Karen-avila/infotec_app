import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private httpClient: HttpClient) { }

  public getClient(clientId: string): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.clients}/${clientId}`, {
      params: { tenantIdentifier: 'default' },
    });
  } 
}
