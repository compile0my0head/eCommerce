import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrders } from '../interfaces/iorders';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private _HttpClient: HttpClient) { }
  myHeaders: any = {token: localStorage.getItem('userToken')} 

  checkOut(cartId: string | null, shippingDetails: IOrders): Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${environment.serverUrl}`,
      {"shippingAddress": shippingDetails},
      {headers: this.myHeaders}
    )
  }
  
  cashOnDelivery(cartId: string | null, shippingDetails: IOrders): Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/${cartId}`,
      {"shippingAddress": shippingDetails},
      {headers: this.myHeaders}
    )
  }
  
}
