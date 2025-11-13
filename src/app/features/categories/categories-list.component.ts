import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {
  private readonly _Categories = inject(CategoriesService);

  isLoading = true;
  errorMsg = '';
  categories: any[] = [];

  ngOnInit(): void {
    this._Categories.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res?.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to load categories';
        this.isLoading = false;
      }
    });
  }
}
