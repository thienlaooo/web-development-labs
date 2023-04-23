import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models";
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../services/auth.service";

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
    public authService: AuthenticationService) { }

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
      })
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id)
      .subscribe( res => {
        this.ngOnInit()
      });
  }

  makeAdmin(id: number): void {
    this.userService.makeAdmin(id)
      .subscribe(res => {
        this.ngOnInit()
      });
  }
}
