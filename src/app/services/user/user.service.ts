import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '@globals/endpoints';
import { CardAccount } from '@globals/classes/card-account';
import { Beneficiarie } from '@globals/interfaces/beneficiarie';
import { Programs } from '@pages/plan-social/plan-social.page';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public username: string;
  public password: string;
  public displayName: string;
  public shortName: string;
  //public accountMovementsSelected: CardAccount;
  public beneficiaries: Beneficiarie[];
  public programaSocialSelected: Programs;

  constructor(private httpClient: HttpClient) { }

  public changeData(data: any) {
    return this.httpClient.put(`${ENDPOINTS.changeData}`, data);
  }
}
