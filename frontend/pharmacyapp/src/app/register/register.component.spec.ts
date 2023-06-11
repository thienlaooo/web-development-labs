import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {HttpClientModule} from "@angular/common/http";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {OrderService} from "../services/order.service";
import {AuthenticationService} from "../services/auth.service";
import {AppErrorDialogComponent} from "../app-error-dialog/app-error-dialog.component";
import {of} from "rxjs";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthenticationService;
  let orderService: OrderService;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        HttpClientModule,
        MatDialogModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        AuthenticationService,
        OrderService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: MatDialog, useValue: { open: jasmine.createSpy('open') } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    orderService = TestBed.inject(OrderService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('first_name')).toBeDefined();
    expect(component.form.get('last_name')).toBeDefined();
    expect(component.form.get('phone')).toBeDefined();
    expect(component.form.get('email')).toBeDefined();
    expect(component.form.get('password')).toBeDefined();
  });

});
