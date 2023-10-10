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

  isLoggedin() {
    if (localStorage.getItem('currentUser')) {
      return true;
    } else {
      return false;
    }
  }

  login(email: string, pwd: string) {
    return this.http.post<User>('http://localhost:3000/api/auth', {
      email: email,
      upwd: pwd,
    });
  }

  logout(event: any) {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('');
  }

  setCurrentuser(newuser: any) {
    localStorage.setItem('currentUser', JSON.stringify(newuser));
  }

  getCurrentuser() {
    return localStorage.getItem('currentUser');
  }
  setUserId(userId: number) {
    this.userId = userId;
  }

  // Thêm phương thức để truy cập userId
  getUserId() {
    return this.userId;
  }
}
