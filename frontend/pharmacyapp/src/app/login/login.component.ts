import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../services/auth.service";

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
    private router: Router) { }

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
        this.router.navigate(['/home']);
      },
      error => {
        alert("Invalid email or password");
      }
    );
  }


}
