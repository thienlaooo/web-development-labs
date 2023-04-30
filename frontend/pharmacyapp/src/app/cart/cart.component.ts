import {Component, OnInit} from '@angular/core';
import {Medicine} from "../models";
import {OrderService} from "../services/order.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  medicines: Medicine[];
  sum: number = 0;

  constructor(
    private orderService: OrderService) { }

  ngOnInit() {
    this.sum = 0;
    this.getOrderItems();

  }

  getOrderItems(){
    this.orderService.getMedicinesInOrder()
      .subscribe(medicines => {
        this.medicines = medicines;
        this.medicines.map(medicine => {
          this.sum += medicine.price;
        })
      });
  }

  deleteMedicine(medicine_id: number){
    // @ts-ignore
    this.orderService.deleteMedicineFromOrder(sessionStorage.getItem('order'), medicine_id)
      .subscribe(_ => {
        this.ngOnInit();
      })
  }
}
