import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models";
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../services/auth.service";
import {AppErrorDialogComponent} from "../app-error-dialog/app-error-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit{
  users: User[] = [];
  customers: User[] = [];
  admins: User[] = [];
  constructor(
    private userService: UserService,
    public authService: AuthenticationService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.customers = [];
    this.admins = [];
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users
        for (const key in users){
          if(users[key].role === 'customer') {
            this.customers.push(users[key]);
          }
          else {
            this.admins.push(users[key]);
          }
        }
      },
        error => {
          this.dialog.open(AppErrorDialogComponent, {
            data: error.error['message'],
            disableClose: true,
          });
        })
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id)
      .subscribe( res => {
        this.ngOnInit()
      },
        error => {
          this.dialog.open(AppErrorDialogComponent, {
            data: error.error['message'],
            disableClose: true,
          });
        });
  }

  makeAdmin(id: number): void {
    this.userService.makeAdmin(id)
      .subscribe(res => {
        this.ngOnInit()
      },
        error => {
          this.dialog.open(AppErrorDialogComponent, {
            data: error.error['message'],
            disableClose: true,
          });
        });
  }
}
