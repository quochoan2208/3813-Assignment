import { Injectable, inject } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';
import { User } from '../user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userId: number | null = null;

  // Check if a user is logged in
  isLoggedin() {
    if (localStorage.getItem('currentUser')) {
      return true;
    } else {
      return false;
    }
  }
 // Perform a login operation with email and password
  login(email: string, pwd: string) {
    return this.http.post<User>('http://localhost:3000/api/auth', {
      email: email,
      upwd: pwd,
    });
  }

  // Logout the user and clear the user data from localStorage
  logout(event: any) {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('');
  }
  // Set the current user in local storage
  setCurrentuser(newuser: any) {
    localStorage.setItem('currentUser', JSON.stringify(newuser));
  }
  // Get the current user data from local storage
  getCurrentuser() {
    return localStorage.getItem('currentUser');
  }

}
