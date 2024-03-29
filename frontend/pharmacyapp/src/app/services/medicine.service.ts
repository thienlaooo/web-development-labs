import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Medicine } from '../models';
import {MessageService} from "./message.service";

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private medicineUrl = "http://127.0.0.1:5000/api/v1/store/inventory";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.medicineUrl)
      .pipe(
        tap(_ => this.log('fetched medicines')),
        catchError(this.handleError<Medicine[]>('getMedicines', []))
      );
  }

  getMedicine(id: number): Observable<Medicine> {
    const url = `http://127.0.0.1:5000/api/v1/medicine/${id}`
    return this.http.get<Medicine>(url).pipe(
      tap(_ => this.log(`fetched medicine id=${id}`)),
      catchError(this.handleError<Medicine>(`getMedicine id=${id}`))
    );
  }

  searchMedicines(term: string, medicines: Medicine[]): Observable<Medicine[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    else {
      const filteredMedicines = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(term.toLowerCase())
      );
      // Return the filtered medicines as an Observable
      return of(filteredMedicines);
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
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
