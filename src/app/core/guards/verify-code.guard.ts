import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const verifyCodeGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const token = localStorage.getItem('forgotPasswordToken');

  if (token) return true;
  _Router.navigate(['/forgot-password']);
  return false;
};
