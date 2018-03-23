import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _router: Router, private _auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Call api for auth
    this._auth.isLoggedIn(
      (outcome) => {
        if (! outcome) this._router.navigate(['/blog']);
      }
    )

    // Calls what we know now
    if (this._auth.loggedIn) return true;

    // Not authorised!
    this._router.navigate(['/blog']);
    return false;

  }
}
