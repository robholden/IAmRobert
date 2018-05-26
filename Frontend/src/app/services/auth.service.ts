import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import * as Fingerprint2 from 'fingerprintjs2';

import { AppConfig } from '../app.config';
import { User } from '../models/user';
import { CommonService } from './common.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _guid = '';

  loggedIn = false;
  user: User = null;
  checkingApi = true;
  checkingUser = true;
  apiUp: boolean = null;

  /**
   * Creates an instance of AuthService.
   *
   * @param {HttpClient} _http
   * @param {AppConfig} _config
   * @param {CookieService} _cookieService
   * @param {CommonService} _common
   * @memberof AuthService
   */
  constructor(
    private _http: HttpClient,
    private _config: AppConfig,
    private _tokenService: TokenService,
    private _common: CommonService
  ) {

    // // Get browser fingerprint to create unique browser sessions
    // new Fingerprint2().get((result, components) => this._guid = result);

    // // Check api status
    // this.apiCheck();

    // // Run login check
    // this.checkForLogin();

  }

  /**
   * Runs an api health check
   *
   * Sets the interval value apiUp to true/false
   *
   * @memberof AuthService
   */
  apiCheck(): void {
    const done = (state) => {
      this.checkingApi = false;
      this.apiUp = state;

      if (!state) this.checkingUser = false;
    }

    this._http
      .get<any>(`${this._config.apiURI}/check`)
      .subscribe(
        () => done(true),
        (err) => {
          console.log(err);
          done(false);
        }
      );
  }

  /**
   * Checks local storage for user data
   *
   * @param {*} [onLogout=null]
   * @returns {void}
   * @memberof AuthService
   */
  checkForLogin(): void {

    // Run on failure
    const onFail = () => {
      this.checkingUser = false;
      this.logout();
    };

    // Only run when api is up
    if (this.apiUp === false)
    {
      onFail();
      return;
    }

    // Validate token
    if (!this._tokenService.token)
    {
      onFail();
      return;
    }

    // Extract user
    try
    {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.loggedIn = true;
    }
    catch (ex)
    {
      onFail();
      return;
    }

    // Complete lookup
    if (!this.loggedIn)
    {
      onFail();
      return;
    }

    // Get user info
    this.rebindUser();

  }

  /**
   * Updates local storage with a given user
   *
   * @param {User} [user=null]
   * @memberof AuthService
   */
  setUser(user: User = null): void {
    if (user != null) this.user = user;
    if (this._common.cookiesEnabled) sessionStorage.setItem('user', JSON.stringify(this.user));
  }

  /**
   * Rebinds the latest version of the user from the api
   *
   * @memberof AuthService
   */
  rebindUser(): void {
    this.checkSession().subscribe(
      (user: User) => {
        this.setUser(user);
        this.checkingUser = false;
      },
      (error) => this.checkingUser = false
    );
  }

  /**
   * Fetch new user instance from api
   *
   * @returns {Observable<User>}
   * @memberof AuthService
   */
  checkSession(): Observable<User> {
    return this._http.get<User>(`${this._config.apiURI}/users/authenticated`);
  }

  /**
   * Logs out the given user by clearing session data and tells our api
   *
   * @param {*} [onComplete=null]
   * @memberof AuthService
   */
  logout(onComplete: any = null): void {

    // Remove session  data
    sessionStorage.removeItem('user');
    this.loggedIn = false;
    this.user = null;

    const onEnd = () => {
      if (onComplete) onComplete();
    }

    // Tell our api they're logging out
    if (this._tokenService.token && this.apiUp)
    {
      this._http
        .get(`${this._config.apiURI}/users/logout?accessToken=${this._tokenService.token}`)
        .subscribe(
          (ok) => onEnd(),
          (err) => onEnd()
        );
    }
    else onEnd();

    // Clear token
    this._tokenService.removeToken();

  }

  /**
   * Attempts to login user via the api
   *
   * @param {string} username
   * @param {string} password
   * @param {boolean} remember
   * @param {*} onComplete
   * @param {*} onError
   * @memberof AuthService
   */
  login(username: string, password: string, remember: boolean, onComplete: any, onError: any): void {

    // Create
    this._http
      .post<any>(`${this._config.apiURI}/users/login`, { username, password, key: this._guid })
      .subscribe(
        (response) => {

          // Validate state
          if (!response.state) return onError(response.message || 'An unexpected error has occurred');

          // Set token
          this._tokenService.setToken(response.token, remember ? response.expiresIn : 0);

          // Get user
          this.checkSession().subscribe((user) => {
            this.setUser(user);
            this.checkForLogin();
            onComplete();
          });

        },
        (error) => onError('An unexpected error has occurred')
      );
  }
}
