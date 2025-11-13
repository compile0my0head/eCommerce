import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

// ✅ Export exactly this name — must match app.config.ts import
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  // Skip spinner for fast UX actions (cart/wishlist) or if explicitly opted out
  const url = req.url || '';
  const skip = url.includes('/api/v1/cart') || url.includes('/api/v1/wishlist') || req.headers.has('X-No-Loading');
  if (!skip) {
    spinner.show(undefined, {
      type: 'ball-spin-clockwise',
      size: 'medium',
      bdColor: 'rgba(14, 7, 26, 0.7)',
      color: '#a78bfa',
      fullScreen: true,
    });
  }

  return next(req).pipe(
    finalize(() => {
      // Hide if it was shown; calling hide safely no-ops otherwise
      spinner.hide();
    })
  );
};
