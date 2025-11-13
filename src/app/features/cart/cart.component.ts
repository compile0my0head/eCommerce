import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ICart } from '../../core/interfaces/icart';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private readonly _CartService = inject(CartService);
  private readonly _Router = inject(Router);
  private readonly _Alert = inject(AlertService);

  cartDetails: ICart = {} as ICart;

  ngOnInit(): void {
    this._CartService.getCartProducts().subscribe({
      next: (res) => this.cartDetails = res.data,
      error: (err) => console.error(err),
    });
  }

  goBackToShopping() {
    this._Router.navigate(['/home']);
  }


  onRemoveItem(id: string) {
    this._CartService.removeSpecificCartProduct(id).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._CartService.cartItemCount.next(res.numOfCartItems)
        this._Alert.toast('Item removed from cart', 'info');
      },
      error: (err) => console.error(err),
    });
  }

  updateItemQuantity(id: string, newCount: number) {
    if (newCount > 0) {
      this._CartService.updateProductQuantity(id, newCount).subscribe({
        next: (res) => {
          this.cartDetails = res.data;
          this._Alert.toast('Quantity updated', 'success');
        },
        error: (err) => console.error(err),
      });
    }
  }

  clearCart() {
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
            this._CartService.cartItemCount.next(0) // for the cart number indicator
            this._Alert.clearedCart();
          }
        },
        error: (err) => console.error(err),
      });
    });
  }
}
