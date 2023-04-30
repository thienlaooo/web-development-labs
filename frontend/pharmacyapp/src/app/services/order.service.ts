import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {BehaviorSubject, Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Medicine, Order, User} from "../models";
import {MessageService} from "./message.service";
import {MedicineService} from "./medicine.service";
import {UserService} from "./user.service";
import {Route, Router} from "@angular/router";


@Injectable({ providedIn: 'root' })
export class OrderService {
  private orderCreated$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private user: User;
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router) { }

  createOrder(): void {
    const createOrderUrl = 'http://127.0.0.1:5000/api/v1/store/order';
    this.userService.getUser()
      .subscribe(user => {
        this.user = user;
        this.http.post<Order>(createOrderUrl, {'customer_id': this.user.id, 'status': 'placed'})
          .pipe(tap((newOrder: Order) => {
              sessionStorage.setItem('order', String(newOrder.id));
              this.orderCreated$.next(true);
            }),
            catchError(this.handleError<Order>('addOrder')))
          .subscribe(); // Add this line to subscribe to the inner observable
      });
  }

  // addMedicineToOrder(id: number): void {
  //   const addMedicineUrl = 'http://127.0.0.1:5000/api/v1/store/order/medicine';
  //    this.http.post<Order>(addMedicineUrl, {'order_id': sessionStorage.getItem("order"), 'medicine_id': id})
  //     .pipe(tap((newOrder: Order) => {
  //       this.log(`added hero w/ id=${newOrder.id}`);
  //       this.router.navigate(['/cart']);
  //       }),
  //       catchError(this.handleError<Order>('addOrder')))
  //    .subscribe();
  // }

  addMedicineToOrder(id: number): Observable<object> {
    const addMedicineUrl = 'http://127.0.0.1:5000/api/v1/store/order/medicine';
     return this.http.post<object>(addMedicineUrl, {'order_id': sessionStorage.getItem("order"), 'medicine_id': id})
      .pipe(tap(_ => {
        }))
  }

  getMedicinesInOrder(): Observable<Medicine[]> {
    const medicineInOrderUrl = `http://127.0.0.1:5000/api/v1/store/order/${sessionStorage.getItem("order")}/getMedicines`;
    return this.http.get<Medicine[]>(medicineInOrderUrl)
      .pipe(
        tap(_ => this.log('fetched medicines')),
        catchError(this.handleError<Medicine[]>('getMedicines', []))
      );
  }

  deleteMedicineFromOrder(order_id: string, medicine_id: number): Observable<object> {
    return this.http.delete(`http://127.0.0.1:5000/api/v1/store/order/${order_id}/${medicine_id}`)
      .pipe(
        tap(resp => console.log(resp)),
        catchError(this.handleError<object>('deleteMedicine', []))
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
