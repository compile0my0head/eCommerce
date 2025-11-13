import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories.service';
import { ProductsService } from '../../core/services/products.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AlertService } from '../../core/services/alert.service';
import { TrimTextPipe } from '../../core/pipes/trim-text.pipe';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterLink],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent implements OnInit {
  private readonly _Route = inject(ActivatedRoute);
  private readonly _Categories = inject(CategoriesService);
  private readonly _Products = inject(ProductsService);
  private readonly _Cart = inject(CartService);
  private readonly _Wishlist = inject(WishlistService);
  private readonly _Alert = inject(AlertService);
  private readonly _Router = inject(Router);
  private trimPipe = new TrimTextPipe();

  isLoading = true;
  errorMsg = '';
  category: any = null;
  products: any[] = [];
  categories: any[] = [];
  private wishlistIds = new Set<string>();

  categorySliderOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    navSpeed: 700,
    responsive: { 0: { items: 2 }, 640: { items: 3 }, 1024: { items: 5 } },
    nav: false
  };

  ngOnInit(): void {
    this._Route.paramMap.subscribe(params => {
      const id = params.get('id')!;
      this.fetchCategory(id);
      this.fetchProducts(id);
    });

    // load categories for slider
    this._Categories.getAllCategories().subscribe({
      next: (res) => (this.categories = res?.data || [])
    });

    // preload wishlist ids
    if (localStorage.getItem('userToken')) {
      this._Wishlist.getWishlist().subscribe({
        next: (res) => {
          const arr = res?.data || [];
          this.wishlistIds = new Set(
            arr.map((p: any) => p?._id || p?.id || p?.product?._id).filter(Boolean)
          );
        }
      });
    }
  }

  private fetchCategory(id: string) {
    this._Categories.getCategorie(id).subscribe({
      next: (res) => { this.category = res?.data; },
      error: (err) => { this.errorMsg = err?.error?.message || 'Failed to load category'; }
    });
  }

  private fetchProducts(categoryId: string) {
    this.isLoading = true;
    this._Products.getProductsByCategory(categoryId).subscribe({
      next: (res) => {
        this.products = res?.data || [];
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onProductClick(productId: string) {
    this._Router.navigate(['products','product-details', productId]);
  }

  onAddToCart(id: string, productTitle: string) {
    if (!localStorage.getItem('userToken')) { this._Router.navigate(['login']); return; }
    this._Cart.addProductToCart(id).subscribe({
      next: (res) => {
        const trimmed = this.trimPipe.transform(productTitle, 3);
        this._Alert.toast(`"${trimmed}"<br> Added To Cart`, 'success');
      },
      error: () => this._Alert.toast('Failed to add item', 'error')
    });
  }

  onAddToWishlist(product: any, productTitle: string) {
    if (!localStorage.getItem('userToken')) { this._Router.navigate(['login']); return; }
    const isIn = this.isWishlisted(product._id);
    if (isIn) {
      this._Wishlist.removeFromWishlist(product._id).subscribe({
        next: () => { this.wishlistIds.delete(product._id); this._Alert.toast(`"${productTitle}" removed from wishlist`, 'info'); },
        error: () => this._Alert.toast('Failed to remove from wishlist', 'error')
      });
    } else {
      this._Wishlist.addToWishlist(product._id).subscribe({
        next: () => { this.wishlistIds.add(product._id); this._Alert.toast(`"${productTitle}" added to wishlist ❤️`, 'success'); },
        error: () => this._Alert.toast('Failed to add to wishlist', 'error')
      });
    }
  }

  isWishlisted(id: string): boolean { return this.wishlistIds.has(id); }

  // rating stars fill style (same approach as Home)
  starFill(rating: number, index: number): string {
    const safe = typeof rating === 'number' ? rating : 0;
    const fill = Math.min(Math.max(safe - (index - 1), 0), 1) * 100;
    return `background: linear-gradient(90deg, #facc15 ${fill}%, #9ca3af ${fill}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`;
  }
}
