import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';
import {IUserData} from '../interfaces/IUserData';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private readonly _httpClient = inject(HttpClient)
userData: IUserData | null = null; // allowing null until set
_Router = inject(Router)

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
