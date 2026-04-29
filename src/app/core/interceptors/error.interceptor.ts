import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// Catches 401/403 from protected endpoints and forces a logout + navigate to /login
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const url = req.url || '';
  const skipAuthEndpoints = url.includes('/api/v1/auth');

  return next(req).pipe(
    catchError((err: any) => {
      const status = err?.status;
      if (!skipAuthEndpoints && (status === 401 || status === 403)) {
        try {
          auth.logOut();
        } catch (e) {
          // Fallback: navigate to login
          try { router.navigate(['/login']); } catch {}
        }
      }
      return throwError(() => err);
    })
  );
};
