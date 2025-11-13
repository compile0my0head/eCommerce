import { ProductsService } from './../../../core/services/products.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../../core/interfaces/iproduct';
import { CartService } from '../../../core/services/cart.service';
import { AlertService } from '../../../core/services/alert.service';
import { NgClass } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgClass],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  private readonly _ProductsService = inject(ProductsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _CartService = inject(CartService);
  private readonly _Alert = inject(AlertService);
  private readonly _Router = inject(Router);
  private readonly _Wishlist = inject(WishlistService);

  productDetails: IProduct | null = null;
  isWishlisted = signal(false); // 🔥 new signal for wishlist toggle

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        const productId = p.get('id');
        if (!productId) return;

        this._ProductsService.getProduct(productId).subscribe({
          next: (res) => {
            console.log(res.data);
            this.productDetails = res.data;
            // check wishlist state for this product
            if (localStorage.getItem('userToken')) {
              this._Wishlist.getWishlist().subscribe({
                next: (w) => {
                  const ids = (w?.data || []).map((p: any) => p?._id || p?.id || p?.product?._id).filter(Boolean);
                  this.isWishlisted.set(ids.includes(this.productDetails!._id));
                }
              });
            }
          },
          error: (err) => console.log(err)
        });
      },
      error: (err) => console.log(err)
    });
  }

  starFill(rating: number, index: number): string {
    const fill = Math.min(Math.max(rating - (index - 1), 0), 1) * 100;
    return `
      background: linear-gradient(90deg, #facc15 ${fill}%, #d1d5db ${fill}%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `;
  }

  onAddToCart(id: string, productTitle: string) {
    if (!localStorage.getItem('userToken')) {
      this._Router.navigate(['login']);
      return;
    }

    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        this._CartService.cartItemCount.next(res.numOfCartItems)
        this._Alert.toast(`"${productTitle}"<br> Added To Cart`, 'success');
      },
      error: () => {
        this._Alert.toast('Failed to add item', 'error');
      }
    });
  }

  toggleWishlist(productId: string, productTitle: string) {
    if (!localStorage.getItem('userToken')) {
      this._Router.navigate(['login']);
      return;
    }

    const adding = !this.isWishlisted();
    if (adding) {
      this._Wishlist.addToWishlist(productId).subscribe({
        next: () => {
          this.isWishlisted.set(true);
          this._Alert.toast(`"${productTitle}" added to wishlist ❤️`, 'success');
        },
        error: () => this._Alert.toast('Failed to add to wishlist', 'error')
      });
    } else {
      this._Wishlist.removeFromWishlist(productId).subscribe({
        next: () => {
          this.isWishlisted.set(false);
          this._Alert.toast(`"${productTitle}" removed from wishlist`, 'info');
        },
        error: () => this._Alert.toast('Failed to remove from wishlist', 'error')
      });
    }
  }
}
