import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./features/home/routes').then(m => m.HOME_ROUTES),
            },
            {
                path: 'wishlist',
                loadChildren: () =>
                    import('./features/wishlist/routes').then(m => m.WISHLIST_ROUTES),
                canActivate: [authGuard]
            },
            {
                path: 'home',
                loadChildren: () =>
                    import('./features/home/routes').then(m => m.HOME_ROUTES),
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('./features/categories/routes').then(m => m.CATEGORIES_ROUTES),
            },
            {
                path: 'products',
                loadChildren: () =>
                    import('./features/products/routes').then(m => m.PRODUCTS_ROUTES),
            },
            {
                path: 'cart',
                loadChildren: () =>
                    import('./features/cart/routes').then(m => m.CART_ROUTES),
                canActivate: [authGuard]
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('./features/profile/routes').then(m => m.PROFILE_ROUTES),
                canActivate: [authGuard]
            },
            {
                path: 'allorders',
                loadChildren: () =>
                    import('./features/allorders/routes').then(m => m.CART_ROUTES),
                canActivate: [authGuard]
            },
            {
                path: 'orders/:id',
                loadChildren: () =>
                    import('./features/orders/routes').then(m => m.ORDERS_ROUTES),
                canActivate: [authGuard]
            },
        ],
    },

    //  Auth routes OUTSIDE the shell
    {
        path: 'login',
        loadChildren: () =>
            import('./features/auth/login/routes').then(m => m.LOGIN_ROUTES),
        canActivate: [loggedGuard]
    },
    {
        path: 'register',
        loadChildren: () =>
            import('./features/auth/register/routes').then(m => m.REGISTER_ROUTES),
        canActivate: [loggedGuard]
    },
    {
        path: 'forgot-password',
        loadChildren: () =>
            import('./features/auth/forgot-password/routes').then(m => m.FORGOTPASSWORD_ROUTES),
        canActivate: [loggedGuard]
    },

    // 404 fallback
    { path: '**', component: NotFoundComponent },
];
