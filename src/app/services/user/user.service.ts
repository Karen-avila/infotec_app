import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '@globals/endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public username: string;
  public password: string;
  public displayName: string;

  constructor(private httpClient: HttpClient) { }

  public changeData(data: any) {
    return this.httpClient.put(`${ENDPOINTS.changeData}`, data);
  }
}
