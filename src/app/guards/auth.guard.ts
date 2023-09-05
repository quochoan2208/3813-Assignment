import { Router, CanActivateFn,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { AuthService} from '../services/auth.service';
import {inject} from '@angular/core';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const val = inject(AuthService).isLoggedin();
  if (val==false){
    inject(Router).navigateByUrl('');
  }else{
    return true;
  }
return false;  
};
