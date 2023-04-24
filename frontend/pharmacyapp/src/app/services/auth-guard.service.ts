import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './auth.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router) {}
  canActivate(): boolean {
    if (this.auth.authenticated$.value) {
      return true;
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
