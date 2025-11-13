import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddressesService } from '../../../core/services/addresses.service';
import { AlertService } from '../../../core/services/alert.service';
import { IAddress } from '../../../core/interfaces/iaddress';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  isFormVisible: boolean = false;
  errorMsg: string = "";
  addressesList: IAddress[] = [];

  private readonly _AddressesService = inject(AddressesService);
  private readonly _Alert = inject(AlertService);
  private readonly _Router = inject(Router);

  getUserAddressesSubscription !: Subscription;
  addAddressSubscription !: Subscription;
  removeAddressSubscription !: Subscription;

  addressForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    details: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    city: new FormControl(null, [Validators.required, Validators.minLength(3)])
  });

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.getUserAddressesSubscription = this._AddressesService.getUserAddresses().subscribe({
      next: (res) => {
        this.addressesList = res.data || [];
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error.message || 'Failed to load addresses';
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.addressForm.reset();
      this.errorMsg = "";
    }
  }

  addAddressSubmit(): void {
    if (this.addressForm.valid) {
      this.isLoading = true;
      this.addAddressSubscription = this._AddressesService.addAddress(this.addressForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.isLoading = false;
            this.errorMsg = "";
            this._Alert.toast('Address added successfully', 'success');
            this.addressForm.reset();
            this.isFormVisible = false;
            this.loadAddresses();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err.error.message;
          this.isLoading = false;
        }
      });
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  removeAddress(addressId: string, addressName: string): void {
    this.removeAddressSubscription = this._AddressesService.removeAddress(addressId).subscribe({
      next: (res) => {
        this._Alert.toast(`"${addressName}" address removed`, 'success');
        this.loadAddresses();
      },
      error: () => {
        this._Alert.toast('Failed to remove address', 'error');
      }
    });
  }

  ngOnDestroy(): void {
    this.getUserAddressesSubscription?.unsubscribe();
    this.addAddressSubscription?.unsubscribe();
    this.removeAddressSubscription?.unsubscribe();
  }
}
