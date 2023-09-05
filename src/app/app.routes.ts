import { Routes } from '@angular/router';
import { authGuard} from './guards/auth.guard';

export const routes: Routes = [
    {path: '', loadChildren: () => import('./login/login.component').then(mod => mod.LoginComponent)},
    {path: 'home', 
    canActivate:[authGuard],
    loadChildren: () => import('./home/home.component').then(mod => mod.HomeComponent)},
    {path: 'profile', 
    canActivate:[authGuard],
    loadChildren: () => import('./profile/profile.component').then(mod => mod.ProfileComponent)},
    {path: 'chat', 
    canActivate:[authGuard],
    loadChildren: () => import('./chat/chat.component').then(mod => mod.ChatComponent)},
];
