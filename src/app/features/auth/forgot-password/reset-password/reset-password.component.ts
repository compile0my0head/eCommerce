import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  isLoading: boolean = false;
  successMsg: boolean = false;
  errorMsg: string = "";

  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  resetPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6}$/)]),
    // rePassword: new FormControl(null, [Validators.required,]),

  }, );

  resetPasswordSubmit(): void {
    if (this.resetPassword.valid) {
      this.isLoading = true;
      this._AuthService.setResetPassword(this.resetPassword.value).subscribe({
        next: (res) => {
          if (res.token) {
            this.isLoading = false;
            this.errorMsg = "";
            this.successMsg = true;

            localStorage.removeItem('forgotPasswordToken');
            localStorage.removeItem('resetStageAllowed');

            setTimeout(() => this._Router.navigate(['/login']), 1500);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err.error.message;
          this.isLoading = false;
        }
      });
    } else {
      this.resetPassword.markAllAsTouched();
    }
  }

    // confirmPassword(form: AbstractControl) // confirm password validation method,,, the parameter (form) is of type abstractcontrol that works with both FormConrtol and FormGroup
    // {
    //   if (form.get('newPassword')?.value === form.get('rePassword')?.value) {
    //     return null;
    //   }
    //   else {
    //     return { mismatch: true }
    //   }
    // }
}
