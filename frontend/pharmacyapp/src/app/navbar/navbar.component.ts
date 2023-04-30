import { Component } from '@angular/core';
import {AuthenticationService} from "../services/auth.service";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  opened$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(public authService: AuthenticationService) {
  }
  toggle(): void {
    console.log('toggle invoked');
    if (this.opened$.value){
      this.opened$.next(false);
    } else {
      this.opened$.next(true);
    }
  }
}
