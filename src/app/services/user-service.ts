import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  age?: number;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: number;
  adminLogin: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  public isLoggedIn = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.getJWTToken()) {
        this.isLoggedIn.set(true);
      } else {
        this.isLoggedIn.set(false);
      }
    });
  }

  public register(data: IRegister): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/auth/register`, data, {
      headers: {
        'Conetent-Type': 'application/json',
      },
    });
  }

  public login(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/auth/login`, data, {
      headers: {
        'Conetent-Type': 'application/json',
      },
    });
  }

  public storeJWTToken(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
  }

  public getJWTToken() {
    return localStorage.getItem('token');
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user_email');
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  public getProfile(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/users/me`);
  }

  public editProfile(data: { firstName: string; lastName: string; picture: string; phoneNumber: string; address: string; age: number }): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/users/edit`, data);
  }

  public changePassword(data: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/users/change-password`, data);
  }

  public deleteAccount(): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}/users/delete`);
  }
}
