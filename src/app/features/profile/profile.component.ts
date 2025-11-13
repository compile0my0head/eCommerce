import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IUserData } from '../../core/interfaces/IUserData';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  userData: IUserData | null = null;

  ngOnInit(): void {
    this._AuthService.saveUserData();
    this.userData = this._AuthService.userData;
    
    if (!this.userData) {
      this._Router.navigate(['/login']);
    }
  }

  logout(): void {
    this._AuthService.logOut();
  }
}
