import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SearchService } from '../../core/services/search.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isScrolledDown = false;
  isHidden = false;
  private lastScrollTop = 0;
  readonly _AuthService = inject(AuthService)
  private readonly _SearchService = inject(SearchService);
  private readonly _CartService = inject(CartService)
  cartItemCount: number = 0;

  searchTerm: string = '';

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  ngOnInit(): void {
    this._CartService.cartItemCount.subscribe({
      next: (data)=>{
        this.cartItemCount = data;
      }
    })

    this._CartService.getCartProducts().subscribe({
      next:(res)=>{
        this._CartService.cartItemCount.next(res.data.products.length) // linking the cart item count for the on reload 0 issue
        console.log(res.data.products.length)
      }
    })
  }

  onSearchChange() {
    this._SearchService.updateSearchTerm(this.searchTerm);
  }

  @HostListener('window:scroll')
  onScroll() {
    const currentScroll = window.scrollY;

    // Apply scrolled style
    this.isScrolledDown = currentScroll > 50;

    // Hide on scroll down, show on scroll up
    if (currentScroll > this.lastScrollTop && currentScroll > 100) {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}
