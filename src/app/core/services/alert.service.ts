import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Observable } from 'rxjs';
import { TrimTextPipe } from '../pipes/trim-text.pipe'; // adjust path

@Injectable({ providedIn: 'root' })
export class AlertService {

  // Toast notification (for add/remove/update)
 toast(
  message: string,
  icon: 'success' | 'info' | 'error' | 'warning' = 'success'
): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    html: `
      <span class="text-violet-300 font-bold tracking-wide">eShop</span><br>
      <span class="text-violet-200">${message}</span>
    `,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: '#1b1330',
    color: '#e5e7eb',
    iconColor: '#a78bfa',
    customClass: {
      popup: 'rounded-xl border border-white/10 px-4 py-2',
      title: 'm-0 p-0 flex flex-col gap-1 text-sm font-medium',
    },
  });
}

  // Observable based confirmation
  confirmClearCart(): Observable<boolean> {
    return new Observable((observer) => {
      Swal.fire({
        title: 'Clear all items?',
        text: 'This will remove all products from your cart.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, clear it',
        cancelButtonText: 'Cancel',
        background: '#1b1330',
        color: '#e5e7eb',
        iconColor: '#a78bfa',
        confirmButtonColor: '#8b5cf6',
        cancelButtonColor: '#4b5563',
        customClass: {
          popup: 'rounded-2xl border border-white/10',
          title: 'text-violet-200 font-semibold',
        },
      }).then((result: SweetAlertResult) => {
        observer.next(result.isConfirmed);
        observer.complete();
      });
    });
  }

  // Simple success alert after clearing
  clearedCart(): void {
    Swal.fire({
      title: 'Cart cleared',
      text: 'Your shopping cart is now empty.',
      icon: 'success',
      background: '#1b1330',
      color: '#e5e7eb',
      iconColor: '#a78bfa',
      confirmButtonColor: '#8b5cf6',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'rounded-2xl border border-white/10',
        title: 'text-violet-200 font-medium',
      },
    });
  }
}
