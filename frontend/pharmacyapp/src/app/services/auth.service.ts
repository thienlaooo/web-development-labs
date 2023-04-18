import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, tap} from 'rxjs/operators';
import { MessageService } from "./message.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public token$: Observable<string> = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<object> {
    return this.http.post<object>('http://127.0.0.1:5000/api/v1/user/login', { email, password })
      .pipe(
        tap(token => {
          // @ts-ignore
          this.tokenSubject.next(token['basic']);
        })
      );
  }

  getToken(): string {
    return this.tokenSubject.value;
  }

  logout(): void {
    this.tokenSubject.next('');
  }
}
