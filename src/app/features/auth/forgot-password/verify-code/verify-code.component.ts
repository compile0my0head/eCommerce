import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent {

  isLoading: boolean = false;
  successMsg: boolean = false;
  errorMsg: string = "";

  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6}$/)])
  });

  verifyCodeSubmit(): void {
    if (this.verifyCode.valid) {
      this.isLoading = true;

      this._AuthService.setVerifyCode(this.verifyCode.value).subscribe({
        next: (res) => {
          if (res.status === 'Success') {
            this.isLoading = false;
            this.errorMsg = "";
            this.successMsg = true;
            localStorage.setItem('resetStageAllowed', 'true');
            setTimeout(() => this._Router.navigate(['/forgot-password/reset-password']), 1500);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err.error.message;
          this.isLoading = false;
        }
      });
    } else {
      this.verifyCode.markAllAsTouched();
    }
  }
}
