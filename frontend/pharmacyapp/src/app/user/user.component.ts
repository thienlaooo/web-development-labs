import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {User} from "../models";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit{
  user: User;

  constructor(
    public authService: AuthenticationService,
    private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    this.userService.getUser()
      .subscribe(user => this.user = user)
  }
}
