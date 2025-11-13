import { Component, OnInit, inject } from '@angular/core';
import { AllordersService } from '../../core/services/allorders.service';
import { AuthService } from '../../core/services/auth.service';
import { IAllorders } from '../../core/interfaces/iallorders';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit {
  private readonly _AllOrdersService = inject(AllordersService);
  private readonly _AuthService = inject(AuthService);

  orders: IAllorders[] = [];
  id: string | null = null;

  ngOnInit(): void {
    if (!this._AuthService.userData) {
      this._AuthService.saveUserData();
    }

    this.id = this._AuthService.userData?.id || null;

    if (this.id) {
      this._AllOrdersService.getUserOrders(this.id).subscribe({
        next: (res) => {
          this.orders = res;
          console.log('User Orders:', this.orders);
        },
        error: (err) => console.error(err),
      });
    } else {
      console.warn('User ID not found — user may not be logged in.');
    }
  }

  getStatus(order: IAllorders): string {
    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Paid, awaiting delivery';
    return 'Processing';
  }
}
