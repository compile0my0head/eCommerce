import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {

  const _Router = inject(Router)

  if(typeof localStorage !== 'undefined') { // to handle the server side rendering errors that generate due to the absence of localStorage which is only on browser
    if(localStorage.getItem('userToken') !== null) {
      return true;
    }
    else {
      _Router.navigate(['/login'])
      return false;
    }

  }
  else {
    return false;
  }
};
