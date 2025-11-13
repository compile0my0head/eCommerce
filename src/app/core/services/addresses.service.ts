import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  private readonly _HttpClient = inject(HttpClient);

  header: any = { token: localStorage.getItem('userToken') };

  getUserAddresses(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/addresses`, {
      headers: this.header
    });
  }

  addAddress(data: object): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/addresses`, data, {
      headers: this.header
    });
  }

  removeAddress(addressId: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/addresses/${addressId}`, {
      headers: this.header
    });
  }

  getSpecificAddress(addressId: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/addresses/${addressId}`, {
      headers: this.header
    });
  }
}
