import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, NgClass } from "@angular/common";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  isLoading: boolean = false; // parameter to control when the loading circle appears on submitting form
  successMsg: boolean = false;
  errorMsg: string = "";
  private readonly _Router = inject(Router)
  private readonly _AuthService = inject(AuthService)

  setRegisterFormSubscribtion ! : Subscription;

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      rePassword: new FormControl(null, [Validators.required,]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
    }, this.confirmPassword
  )

  registerSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true

      this.setRegisterFormSubscribtion = this._AuthService.setRegisterForm(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res)
          if (res.message == 'success')  {
            this.isLoading = false
            this.errorMsg = "";
            this.successMsg = true;
          
            setTimeout(() => {
              this._Router.navigate(['/login'])
            }, 2000);
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
      this.registerForm.setErrors({ mismatch: true })
      this.registerForm.markAllAsTouched()

    }
    console.log(this.registerForm)
  }

  confirmPassword(form: AbstractControl) // confirm password validation method,,, the parameter (form) is of type abstractcontrol that works with both FormConrtol and FormGroup
  {
    if (form.get('password')?.value === form.get('rePassword')?.value) {
      return null;
    }
    else {
      return { mismatch: true }
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.setRegisterFormSubscribtion?.unsubscribe();
  }
}
