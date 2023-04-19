import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, tap} from 'rxjs/operators';
import { MessageService } from "./message.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  authenticated$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private router: Router) { }

  login(email: string, password: string): Observable<object> {
    return this.http.post<object>('http://127.0.0.1:5000/api/v1/user/login', { email, password })
      .pipe(
        tap(token => {
          // @ts-ignore
          this.tokenSubject.next(token['basic']);
          this.authenticated$.next(true);
        })
      );
  }

  getToken(): string {
    return this.tokenSubject.value;
  }

  logout(): void {
    this.authenticated$.next(false);
    this.tokenSubject.next('');
    void this.router.navigate(['/home']);
  }
}
