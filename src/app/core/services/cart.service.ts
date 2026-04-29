import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  private readonly _HttpClient = inject(HttpClient)
  get header(): any { return { token: localStorage.getItem('userToken') }; }
  cartItemCount : BehaviorSubject<number> = new BehaviorSubject(0); // to use subscribtion on it later for the change detection in navbar, initial value 0

  // Refresh cart count from backend and update the BehaviorSubject
  refreshCartCount(): void {
    // Attempt to fetch cart products and update count; tolerate errors by setting 0
    this.getCartProducts().subscribe({
      next: (res) => {
        const count = res?.numOfCartItems ?? res?.data?.products?.length ?? 0;
        this.cartItemCount.next(count);
      },
      error: () => {
        this.cartItemCount.next(0);
      }
    });
  }

  addProductToCart(id: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/cart`,
    {"productId" : id},
    { headers: this.header}
   );
  }

  getCartProducts(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/cart`,
      {headers: this.header}
    )
  }

  removeSpecificCartProduct(id: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`,
      {headers: this.header}
    )
  }

  updateProductQuantity(id: string, newCount: number): Observable<any> {
    return this._HttpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`, 
      {'count': newCount},
      {headers: this.header}
    )
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart`,
      {headers: this.header}
    )
  }

}
