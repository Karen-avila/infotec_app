import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '@globals/endpoints';
import { Storage } from '@ionic/storage';

interface ChangePassword {
  password: string;
  repeatPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  public changePassword(data: ChangePassword) {
    return this.httpClient.put(`${ENDPOINTS.resetPassword}`, data);
  }

}
