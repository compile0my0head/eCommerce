import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {

  private readonly _Wishlist = inject(WishlistService);
  private readonly _Alert = inject(AlertService);

  isLoading = signal(true);
  errorMsg = signal('');
  items = signal<any[]>([]);

  ngOnInit(): void {
    this.loadWishlist();
  }

  trackById = (index: number, p: any) => p?._id || p?.id || p?.product?._id || index;

  loadWishlist(): void {
    this.isLoading.set(true);
    this.errorMsg.set('');
    this._Wishlist.getWishlist().subscribe({
      next: (res) => {
        this.items.set(res?.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message || 'Failed to load wishlist');
        this.isLoading.set(false);
      }
    });
  }

  remove(productId: string, title?: string): void {
    this._Wishlist.removeFromWishlist(productId).subscribe({
      next: (res) => {
        // optimistic update
        this.items.update(list => list.filter((p: any) => (p._id || p.id) !== productId));
        this._Alert.toast(`${title || 'Item'} removed from wishlist`, 'success');
      },
      error: () => this._Alert.toast('Could not remove item', 'error')
    });
  }
}
