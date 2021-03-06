import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@globals/endpoints';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CodesService {

  constructor(private httpClient: HttpClient) { }

  public getFAQS(): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.codesOptions}/FAQS/options`).pipe(
      map( (data: any) => {
        return data.codeValues;
      } )
    );
  }

  public getMOBILE(): Observable<any> {
    return this.httpClient.get(`${ENDPOINTS.codesOptions}/MOBILE/options`).pipe(
      map( (data: any) => {
        let obj = {};        
        
        for (const key in data.codeValues) {
          const item = data.codeValues[key];
          obj[item.name] = item;
        }

        return obj;
      } )
    );
  }
}
