import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";

export const PROFILE_ROUTES: Routes = [
    {
        path: '',
        component: ProfileComponent
    },
    {
        path: 'addresses',
        loadComponent: () => import('./addresses/addresses.component').then(m => m.AddressesComponent)
    }
]