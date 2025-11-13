import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  isLoading: boolean = false; // parameter to control when the loading circle appears on submitting form
  successMsg: boolean = false;
  errorMsg: string = "";

  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

  emailVerify: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  })


  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6}$/)])
  })

  resetPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  })


    emailVerifySubmit(): void {
      if (this.emailVerify.valid) {
        this.isLoading = true
  
        this._AuthService.setEmailVerify(this.emailVerify.value).subscribe({
          next: (res) => {
            console.log(res)
            if (res.statusMsg == 'success') {
              this.isLoading = false
              this.errorMsg = "";
              this.successMsg = true;
  
              // save token
              localStorage.setItem('forgotPasswordToken', res.token)
              // decode token
              this._AuthService.saveUserData()
  
              setTimeout(() => {
                this._Router.navigate(['forgot-password/verify-code'])
              }, 1500);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.errorMsg = err.error.message
            console.log(err)
            this.isLoading = false
          }
        })
      }
      else {
        this.emailVerify.markAllAsTouched()
  
      }
      console.log(this.emailVerify)
    }

}
