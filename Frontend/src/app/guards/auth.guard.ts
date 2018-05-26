import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _router: Router, private _auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // Login redirect
    const goToLogin: any = () => this._router.navigate(['/login'], { queryParams: { ref } });

    // Get current url and check login status
    const ref = state.url.slice(1, state.url.length);
    this._auth
      .checkSession()
      .pipe(
        map((user) => this._auth.setUser(user))
      )
      .subscribe(
        (ok) => { },
        (err) => this._auth.logout(() => goToLogin())
      );

    if (this._auth.loggedIn)
    {
      return true;
    }

    goToLogin();
    return false;
  }
}
