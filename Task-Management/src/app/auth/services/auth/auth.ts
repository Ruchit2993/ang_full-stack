import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:8086/';

export interface RegisterPayload {
  name: string;
  email: string;
  contact?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${BASE}auth/register`, payload);
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${BASE}auth/login`, payload);
  }
}

