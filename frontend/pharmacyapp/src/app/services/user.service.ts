import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Medicine, User} from "../models";
import {MessageService} from "./message.service";


@Injectable({ providedIn: 'root' })
export class UserService {
  private userUrl = `http://127.0.0.1:5000/api/v1/user/${sessionStorage["email"]}`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getUser(): Observable<User>{
    return this.http.get<User>(`http://127.0.0.1:5000/api/v1/user/${sessionStorage["email"]}`)
      .pipe(
        tap(_ => this.log('fetched user')),
        catchError(this.handleError<User>('getUser', ))
      );
  }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>('http://127.0.0.1:5000/api/v1/user')
      .pipe(
        tap(_ => this.log('fetched users')),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  deleteUser(id: number): Observable<object> {
    return this.http.delete<object>(`http://127.0.0.1:5000/api/v1/user/${id}`)
      .pipe(
        tap(resp => console.log(resp)),
        catchError(this.handleError<object>('deleteUser', []))
      )
  }

  makeAdmin(id: number): Observable<object> {
    return this.http.put(`http://127.0.0.1:5000/api/v1/user`, {id: id, role: 'pharmacist'})
      .pipe(
        tap(resp => console.log(resp)),
        catchError(this.handleError<object>('adminUser', []))
      )
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
