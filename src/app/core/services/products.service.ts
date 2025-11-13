import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // constructor() { }

  private readonly _HttpClient = inject(HttpClient)

  getAllProducts():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/products`)
  }

  getProduct(id: string | null):Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/products/${id}`)
  }

  // Fetch products filtered by category id
  // RouteMisr API supports filtering with `category=<id>`
  getProductsByCategory(categoryId: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/products`, {
      params: { category: categoryId }
    });
  }

}
