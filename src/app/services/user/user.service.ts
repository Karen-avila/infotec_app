import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '@globals/endpoints';
import { CardAccount } from '@globals/classes/card-account';
import { BeneficiarieTPT } from '@globals/interfaces/beneficiarie-tpt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public username: string;
  public password: string;
  public displayName: string;
  public accountMovementsSelected: CardAccount;
  public beneficiaries: BeneficiarieTPT[];

  constructor(private httpClient: HttpClient) { }

  public changeData(data: any) {
    return this.httpClient.put(`${ENDPOINTS.changeData}`, data);
  }
}
