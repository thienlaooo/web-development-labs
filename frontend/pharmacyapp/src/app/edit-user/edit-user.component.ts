import {Component, OnInit} from '@angular/core';
import {User} from "../models";
import {AuthenticationService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AppErrorDialogComponent} from "../app-error-dialog/app-error-dialog.component";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit{
  user: User;
  form: FormGroup;

  constructor(private fb: FormBuilder,
  private userService: UserService,
  private dialog: MatDialog,
  private router: Router) { }

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    this.userService.getUser()
      .subscribe(user => {
        this.user = user
        this.form = this.fb.group({     // {5}
          first_name: [this.user.first_name, Validators.required],
          last_name: [this.user.last_name, Validators.required],
          email: [this.user.email, Validators.required],
          phone: [this.user.phone, Validators.required]
        });
      })
  }

  editUser(): void {
    this.userService.editUser(this.user.id, this.form.value['first_name'], this.form.value['last_name'], this.form.value['email'], this.form.value['phone']).subscribe(
      _ => {
        this.router.navigate(['/user']);
      },
      error => {
        this.dialog.open(AppErrorDialogComponent, {
          data: error.error,
          disableClose: true,
        });
      }
    )
  }
}
