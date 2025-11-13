import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';          
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FloatingCartComponent } from '../../shared/floating-cart/floating-cart.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,        
    NavbarComponent,     
    FooterComponent,
    FloatingCartComponent
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {}
