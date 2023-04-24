import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../models";
import {catchError, tap} from "rxjs/operators";
import {OrderService} from "../services/order.service";
import {Router} from "@angular/router";
import {of, pipe} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AppErrorDialogComponent} from "../app-error-dialog/app-error-dialog.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  form: FormGroup;
  constructor(
    public authService: AuthenticationService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onRegister(): void {
    this.authService.register(this.form.value['first_name'], this.form.value['last_name'], this.form.value['password'], this.form.value['phone'], this.form.value['email'], 'customer')
      .pipe(tap(_ => {
        this.authService.login(this.form.value['email'], this.form.value['password']).subscribe(
          token => {
            sessionStorage.setItem("email", this.form.value['email']);
            this.orderService.createOrder();
            this.router.navigate(['/home']);
          },
          error => {
            this.dialog.open(AppErrorDialogComponent, {
              data: error.error['message'],
              disableClose: true,
            });
          }
        );}),
        catchError((error) => {
          console.log(error);
          this.dialog.open(AppErrorDialogComponent, {
            data: error.error,
            disableClose: true,
          })
          return of(null);
        }))
      .subscribe();
  }
}
