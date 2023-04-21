import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../services/auth.service";
import {OrderService} from "../services/order.service";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.form = this.fb.group({     // {5}
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    // get username and password from form
    this.authService.login(this.form.value['email'], this.form.value['password']).subscribe(
      token => {
        sessionStorage.setItem("email", this.form.value['email']);
        this.orderService.createOrder();
        this.router.navigate(['/home']);
      },
      error => {
        alert("Invalid email or password");
      }
    );
    // this.authService.login(this.form.value['email'], this.form.value['password'])
    //   .pipe(
    //     tap(_ => {
    //       sessionStorage.setItem('email', this.form.value['email']);
    //       this.orderService.createOrder();
    //       this.router.navigate(['/home']);
    //     })
    //   ).subscribe();
  }


}
