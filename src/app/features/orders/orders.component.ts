import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { IOrders } from '../../core/interfaces/iorders';
import { AddressesService } from '../../core/services/addresses.service';
import { CartService } from '../../core/services/cart.service';
import { IAddress } from '../../core/interfaces/iaddress';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {

  private readonly _Router = inject(Router)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _OrdersServices = inject(OrdersService)
  private readonly _AddressesService = inject(AddressesService)
  private readonly _CartService = inject(CartService)
  
  cartId: string | null = "";
  shippingDetails: IOrders = {} as IOrders;
  addressesList: IAddress[] = [];
  selectedAddressId: string | null = null;
  useManualEntry: boolean = false;
  paymentMethod: 'stripe' | 'cash' = 'stripe';
  
  getUserAddressesSubscription !: Subscription;
  

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({ // getting the cart id that we sent with cart routerlink
      next: (params)=>{
        this.cartId = params.get('id')
        console.log(this.cartId)
      },
      error: (err)=>{
        console.log(err)
      }
    })
    
    // Load saved addresses
    if (localStorage.getItem('userToken')) {
      this.getUserAddressesSubscription = this._AddressesService.getUserAddresses().subscribe({
        next: (res) => {
          this.addressesList = res.data || [];
        },
        error: (err) => console.log(err)
      });
    }
  }

  orders: FormGroup = new FormGroup({
    details: new FormControl(null, Validators.required),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    city: new FormControl(null, Validators.required),
  })

  goBackToCart() {
    this._Router.navigate(['/cart']);
  }

  selectAddress(address: IAddress): void {
    this.selectedAddressId = address._id!;
    this.useManualEntry = false;
    this.orders.patchValue({
      details: address.details,
      phone: address.phone,
      city: address.city
    });
  }
  
  toggleManualEntry(): void {
    this.useManualEntry = true;
    this.selectedAddressId = null;
    this.orders.reset();
  }

  onCheckout() {
    if (this.orders.valid) {
      this.shippingDetails = this.orders.value;
      
      if (this.paymentMethod === 'stripe') {
        this._OrdersServices.checkOut(this.cartId, this.shippingDetails).subscribe({
          next: (res)=>{
            console.log(res);
            if(res.status === 'success') {
              this._CartService.cartItemCount.next(0);
              window.open(res.session.url, '_self') // opens the stripe payement link (url from api response)
            }
          },
          error: (err)=>{
            console.log(err)
          }
        })
      } else if (this.paymentMethod === 'cash') {
        this._OrdersServices.cashOnDelivery(this.cartId, this.shippingDetails).subscribe({
          next: (res)=>{
            console.log(res);
            if(res.status === 'success') {
              this._CartService.cartItemCount.next(0);
              this._Router.navigate(['/allorders']);
            }
          },
          error: (err)=>{
            console.log(err)
          }
        })
      }
    } else {
      this.orders.markAllAsTouched();
    }
  }
  
  ngOnDestroy(): void {
    this.getUserAddressesSubscription?.unsubscribe();
  }
}
