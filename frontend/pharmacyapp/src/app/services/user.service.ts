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
    return this.http.get<User>(this.userUrl)
      .pipe(
        tap(_ => this.log('fetched user')),
        catchError(this.handleError<User>('getUser', ))
      );
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
