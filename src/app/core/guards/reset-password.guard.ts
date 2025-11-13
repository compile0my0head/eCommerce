import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const resetPasswordGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const verified = localStorage.getItem('resetStageAllowed');

  if (verified === 'true') return true;
  _Router.navigate(['/forgot-password/verify-code']);
  return false;
};
