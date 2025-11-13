import { Component, inject, OnInit, computed, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { register } from 'swiper/element/bundle';
import { TrimTextPipe } from '../../core/pipes/trim-text.pipe';
import { SearchService } from '../../core/services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AlertService } from '../../core/services/alert.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, TrimTextPipe, SearchPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] //  Allow Web Components

})
export class HomeComponent implements OnInit {
  
  private _Router = inject(Router);
  private _CategoriesService = inject(CategoriesService);
  private _ProductsService = inject(ProductsService);
  private readonly _SearchService = inject(SearchService)
  private readonly _CartService = inject(CartService)
  private readonly _Alert = inject(AlertService)
  private readonly _Wishlist = inject(WishlistService)
  private trimPipe = new TrimTextPipe();

  
  productsList = signal<IProduct[]>([]);
  categoriesList: ICategory[] = [];
  currentPage = signal(1);
  itemsPerPage = 16;
  searchTerm: string = '';
  private wishlistIds = new Set<string>();

  constructor() {
    
    // search
    this._SearchService.searchTerm$
    .pipe(takeUntilDestroyed())
    .subscribe(term => this.searchTerm = term);
  }
  
  getAllProductsSubscribtion ! : Subscription;
  getAllCategoriesSubscribtion ! : Subscription;
  
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['Next', 'Prev'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  
  mainSliderImages = [
    'assets/images/bannerx1.jpg',
    'assets/images/bannerx2.png',
    'assets/images/bannerx3.png',
  ];

  sideImages = [
    'assets/images/side1.jpg',
    'assets/images/side2.jpg',
    'assets/images/side3.jpg',
    'assets/images/side4.jpg',
  ];
  
  onProductClick(productId: string) {
    this._Router.navigate(['products','product-details', productId])
  }

  paginatedProducts = computed(() => {
    const list = this.productsList();
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return list.slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.productsList().length / this.itemsPerPage) || 1);

  ngOnInit(): void {
    this.getAllProductsSubscribtion = this._ProductsService.getAllProducts().subscribe({
      next: (res) => this.productsList.set(res.data),
      error: (err) => console.error(err),
    });

    this.getAllCategoriesSubscribtion = this._CategoriesService.getAllCategories().subscribe ({
      next: (res)=> {
        console.log(res.data)
        this.categoriesList = res.data
      },
      error: (err)=> {
        console.log(err)
      }
    })

    register(); // for the swiper slider

    // preload wishlist ids for filled-heart state
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.getAllProductsSubscribtion?.unsubscribe();
  }





  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.update((p) => p + 1);
  }

  prevPage() {
    if (this.currentPage() > 1) this.currentPage.update((p) => p - 1);
  }

  onViewDetails(product: IProduct) {
    console.log('View details:', product.title);
    // this._Router.navigate(['/product', product]);
  }

  onAddToCart(id: string, productTitle: string) {
    if (!localStorage.getItem('userToken')) {
      this._Router.navigate(['login']);
      return;
    }

    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        const trimmedTitle = this.trimPipe.transform(productTitle, 3);
        this._Alert.toast(` "${trimmedTitle}"<br> Added To Cart`, 'success');
        this._CartService.cartItemCount.next(res.numOfCartItems)
      },
      error: () => {
        this._Alert.toast('Failed to add item', 'error');
      }
    });
  }

  onAddToWishlist(product: IProduct, productTitle: string) {
    if (!localStorage.getItem('userToken')) {
      this._Router.navigate(['login']);
      return;
    }

    const isInWishlist = this.isWishlisted(product._id);

    if (isInWishlist) {
      this._Wishlist.removeFromWishlist(product._id).subscribe({
        next: () => {
          this.wishlistIds.delete(product._id);
          this._Alert.toast(`"${productTitle}" removed from wishlist`, 'info');
        },
        error: () => this._Alert.toast('Failed to remove from wishlist', 'error')
      });
    } else {
      this._Wishlist.addToWishlist(product._id).subscribe({
        next: () => {
          this.wishlistIds.add(product._id);
          this._Alert.toast(`"${productTitle}" added to wishlist ❤️`, 'success');
        },
        error: () => this._Alert.toast('Failed to add to wishlist', 'error')
      });
    }
  }

  isWishlisted(id: string): boolean {
    return this.wishlistIds.has(id);
  }

  // rating stars

  starFill(rating: number, index: number): string {
    const fill = Math.min(Math.max(rating - (index - 1), 0), 1) * 100;
    return `
      background: linear-gradient(90deg, #facc15 ${fill}%, #d1d5db ${fill}%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `;
  }


}
