import { Routes } from '@angular/router';
import { loggedGuard } from '../../../core/guards/logged.guard';
import { verifyCodeGuard } from '../../../core/guards/verify-code.guard';
import { resetPasswordGuard } from '../../../core/guards/reset-password.guard';


export const FORGOTPASSWORD_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./forgot-password.component').then(m => m.ForgotPasswordComponent), canActivate: [loggedGuard] },
  { path: 'verify-code', loadComponent: () => import('./verify-code/verify-code.component').then(m => m.VerifyCodeComponent), canActivate: [verifyCodeGuard] },
  { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent), canActivate: [resetPasswordGuard] }
];
