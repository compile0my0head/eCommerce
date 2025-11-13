import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, NgClass } from "@angular/common";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass, CommonModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  isLoading: boolean = false; // parameter to control when the loading circle appears on submitting form
  successMsg: boolean = false;
  errorMsg: string = "";
  private readonly _Router = inject(Router)
  private readonly _AuthService = inject(AuthService)

  loginForm: FormGroup = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    }
  )

  loginSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true

      this._AuthService.setLoginForm(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res)
          if (res.message == 'success') {
            this.isLoading = false
            this.errorMsg = "";
            this.successMsg = true;

            // save token
            localStorage.setItem('userToken', res.token)
            // decode token
            this._AuthService.saveUserData()

            setTimeout(() => {
              this._Router.navigate(['/home'])
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
      this.loginForm.setErrors({ mismatch: true })
      this.loginForm.markAllAsTouched()

    }
    console.log(this.loginForm)
  }



}
