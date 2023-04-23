import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../models";
import {catchError, tap} from "rxjs/operators";
import {OrderService} from "../services/order.service";
import {Router} from "@angular/router";
import {pipe} from "rxjs";

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
    private router: Router) { }

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
    console.log('Invoked on register');
    this.authService.register(this.form.value['first_name'], this.form.value['last_name'], this.form.value['password'], this.form.value['phone'], this.form.value['email'], 'customer')
      .pipe(tap(_ => {
        this.authService.login(this.form.value['email'], this.form.value['password']).subscribe(
          token => {
            sessionStorage.setItem("email", this.form.value['email']);
            this.orderService.createOrder();
            this.router.navigate(['/home']);
          },
          error => {
            alert("Invalid email or password");
          }
        );}),
        catchError(err => {throw 'error in source. Details: ' + err;}))
      .subscribe();
  }
}
