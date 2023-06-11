import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import {HttpClientModule} from "@angular/common/http";
import {Medicine} from "../models";
import {of} from "rxjs";
import {OrderService} from "../services/order.service";
import {AuthenticationService} from "../services/auth.service";

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let orderServiceMock: jasmine.SpyObj<OrderService>;

  const mockMedicines: Medicine[] = [
    {
      id: 1,
      name: "SomeName",
      price: 10,
      photoUrls: ["url"],
      quantity: 10,
      producer: "Producer",
      inDemand: true
    },
    {
      id: 2,
      name: "SomeName2",
      price: 20,
      photoUrls: ["url"],
      quantity: 20,
      producer: "Producer2",
      inDemand: true
    },
  ];


  beforeEach(async () => {
    orderServiceMock = jasmine.createSpyObj('OrderService', ['getMedicinesInOrder', 'deleteMedicineFromOrder']);
    orderServiceMock.getMedicinesInOrder.and.returnValue(of(mockMedicines));

    await TestBed.configureTestingModule({
      declarations: [ CartComponent ],
      imports: [HttpClientModule],
      providers: [
        { provide: OrderService, useValue: orderServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch order items and calculate sum on ngOnInit', () => {

    component.ngOnInit();

    expect(orderServiceMock.getMedicinesInOrder).toHaveBeenCalled();
    expect(component.medicines).toEqual(mockMedicines);
    expect(component.sum).toEqual(30);
  });

  // it('should delete medicine and call ngOnInit on deleteMedicine', () => {
  //   const medicineId = 1;
  //   orderServiceMock.deleteMedicineFromOrder.and.returnValue(of(null));
  //
  //   spyOn(component, 'ngOnInit');
  //
  //   component.deleteMedicine(medicineId);
  //
  //   expect(orderServiceMock.deleteMedicineFromOrder).toHaveBeenCalledWith(
  //     sessionStorage.getItem('order'),
  //     medicineId
  //   );
  //   expect(component.ngOnInit).toHaveBeenCalled();
  // });
});
