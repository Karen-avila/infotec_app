import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '@globals/endpoints';
import { Storage } from '@ionic/storage';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  public changeData(data: any) {
    
    return this.httpClient.put(`${ENDPOINTS.changeData}`, data);
  }



}
