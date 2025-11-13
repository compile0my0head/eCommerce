import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { ICart } from '../../core/interfaces/icart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-floating-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-cart.component.html',
  styleUrl: './floating-cart.component.scss'
})
export class FloatingCartComponent implements OnInit, OnDestroy {
  private readonly _CartService = inject(CartService);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  private readonly _Alert = inject(AlertService);

  cartDetails: ICart = {} as ICart;
  isMinimized = signal(false);
  isVisible = signal(false);
  private cartSubscription?: Subscription;

  ngOnInit(): void {
    // Only load cart if user is logged in
    if (this.isLoggedIn) {
      this.loadCart();
      
      // Subscribe to cart changes
      this.cartSubscription = this._CartService.cartItemCount.subscribe(() => {
        this.loadCart();
      });
    }
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem('userToken') !== null;
  }

  get hasItems(): boolean {
    return this.cartDetails?.products?.length > 0;
  }

  get shouldShow(): boolean {
    return this.isLoggedIn && this.hasItems && this.isVisible();
  }

  loadCart(): void {
    this._CartService.getCartProducts().subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        // Show cart if it has items
        if (this.cartDetails?.products?.length > 0) {
          this.isVisible.set(true);
        } else {
          this.isVisible.set(false);
        }
      },
      error: (err) => console.error(err),
    });
  }

  toggleMinimize(): void {
    this.isMinimized.update(val => !val);
  }

  closeCart(): void {
    this.isVisible.set(false);
  }

  updateQuantity(productId: string, newCount: number): void {
    if (newCount > 0) {
      this._CartService.updateProductQuantity(productId, newCount).subscribe({
        next: (res) => {
          this.cartDetails = res.data;
          this._Alert.toast('Quantity updated', 'success');
        },
        error: (err) => console.error(err),
      });
    }
  }

  removeItem(productId: string): void {
    this._CartService.removeSpecificCartProduct(productId).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._CartService.cartItemCount.next(res.numOfCartItems);
        this._Alert.toast('Item removed from cart', 'info');
        
        // Hide cart if no items left
        if (this.cartDetails?.products?.length === 0) {
          this.isVisible.set(false);
        }
      },
      error: (err) => console.error(err),
    });
  }

  clearCart(): void {
    this._Alert.confirmClearCart().subscribe((confirmed) => {
      if (!confirmed) return;

      this._CartService.clearCart().subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.cartDetails = {
              _id: '',
              cartOwner: '',
              products: [],
              createdAt: '',
              updatedAt: '',
              __v: 0,
              totalCartPrice: 0,
            };
            this._CartService.cartItemCount.next(0);
            this._Alert.clearedCart();
            this.isVisible.set(false);
          }
        },
        error: (err) => console.error(err),
      });
    });
  }

  proceedToCheckout(): void {
    if (this.cartDetails?._id) {
      this._Router.navigate(['/orders', this.cartDetails._id]);
    }
  }
}
