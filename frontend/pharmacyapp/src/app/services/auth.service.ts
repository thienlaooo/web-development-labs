import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import { MessageService } from "./message.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Router} from "@angular/router";
import {Medicine, User} from "../models";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  authenticated$: BehaviorSubject<boolean> = new BehaviorSubject(sessionStorage.getItem('basic') !== null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService) { }


  login(email: string, password: string): Observable<object> {
    return this.http.post<object>('http://127.0.0.1:5000/api/v1/user/login', { email, password })
      .pipe(
        tap(token => {
          // @ts-ignore
          this.tokenSubject.next(token['basic']);
          this.authenticated$.next(true);
          sessionStorage.setItem('basic', this.tokenSubject.value);
        })
      );
  }

  register(first_name: string, last_name: string, password: string, phone: string, email: string): Observable<object> {
     return this.http.post<object>('http://127.0.0.1:5000/api/v1/user', {first_name:first_name, last_name:last_name, password:password, phone:phone, email:email, role:'customer'})
       .pipe(
         tap(_ => this.log('created user')),
         catchError(this.handleError<User>('register', )));
  }

  getToken(): string {
    const token = sessionStorage.getItem('basic');
    return token !== null ? token : '';
  }

  logout(): void {
    this.authenticated$.next(false);
    sessionStorage.clear();
    this.tokenSubject.next('');
    void this.router.navigate(['/home']);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`MedicineService: ${message}`);
  }
}
