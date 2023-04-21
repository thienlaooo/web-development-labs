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

  constructor(
    private orderService: OrderService) { }

  ngOnInit() {
    this.getOrderItems();
  }

  getOrderItems(){
    this.orderService.getMedicinesInOrder()
      .subscribe(medicines => this.medicines = medicines);
  }
}
