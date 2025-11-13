import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class WishlistService {

  private readonly _HttpClient = inject(HttpClient);

  // maintain a header like other services (cart) for consistency
  header: any = { token: localStorage.getItem('userToken') };

  // count for navbar badges, etc.
  wishlistItemCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  addToWishlist(productId: string): Observable<any> {
    return this._HttpClient
      .post(
        `${environment.baseUrl}/api/v1/wishlist`,
        { productId },
        { headers: this.header }
      )
      .pipe(tap((res: any) => this._syncCountFromResponse(res)));
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this._HttpClient
      .delete(
        `${environment.baseUrl}/api/v1/wishlist/${productId}`,
        { headers: this.header }
      )
      .pipe(tap((res: any) => this._syncCountFromResponse(res)));
  }

  getWishlist(): Observable<any> {
    return this._HttpClient
      .get(`${environment.baseUrl}/api/v1/wishlist`, { headers: this.header })
      .pipe(tap((res: any) => this._syncCountFromResponse(res)));
  }

  private _syncCountFromResponse(res: any): void {
    // backend typically returns { data: [...] }
    const items = res?.data;
    if (Array.isArray(items)) {
      this.wishlistItemCount.next(items.length);
    }
  }
}
