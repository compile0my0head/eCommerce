import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';
import {IUserData} from '../interfaces/IUserData';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private readonly _httpClient = inject(HttpClient)
userData: IUserData | null = null; // allowing null until set
_Router = inject(Router)
private readonly _CartService = inject(CartService);
private readonly _WishlistService = inject(WishlistService);

setRegisterForm (data: object): Observable<any> // parameter "data" has the data we are sending to the backend from the registration form
{
  return this._httpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, data)
}

setLoginForm (data: object): Observable<any> // parameter "data" has the data we are sending to the backend from the registration form
{
  return this._httpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, data)
}

saveUserData(): void {
  if(localStorage.getItem('userToken') !==  null) {
    this.userData = jwtDecode(localStorage.getItem('userToken') !)
    console.log(this.userData)
  }
}

logOut() {
  localStorage.removeItem('userToken');
  this.userData = null;
  // Reset counts and navigate to login
  try { this._CartService.cartItemCount.next(0); } catch {}
  try { this._WishlistService.wishlistItemCount.next(0); } catch {}
  this._Router.navigate(['/login'])
}

// forgot password section
setEmailVerify(data: object) :Observable<any> 
{
  return this._httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, data)
}

setVerifyCode(data: object) :Observable<any> 
{
  return this._httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, data)
}

setResetPassword(data: object) :Observable<any> 
{
  return this._httpClient.post(`${environment.baseUrl}/api/v1/auth/resetPassword`, data)
}



}
