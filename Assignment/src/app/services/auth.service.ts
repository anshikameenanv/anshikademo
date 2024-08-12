import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private router: Router) { }

  private readonly TOKEN_KEY = 'token';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  fetchTokenAndParse(): any | null {
    const token = this.getToken();
    if (token) {
      return this.parseJwt(token);
    }
    else {
      return null;
    }
  }

  isLoggedIn() {
    return this.getToken() != null;
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('UserData');
    localStorage.removeItem('traveler');

    // this.router.navigate(['login']);
  }

  parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }
}
