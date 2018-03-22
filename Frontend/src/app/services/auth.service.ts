import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { CookieService } from 'angular2-cookie';
import * as Fingerprint2 from 'fingerprintjs2';

import { AppConfig } from '../app.config';
import { User } from '../models/user';
import { CommonService } from './common.service';

@Injectable()
export class AuthService {
  private _guid = '';

  loggedIn = false;
  token = '';
  user: User;

  constructor(
    private _http: Http,
    private _config: AppConfig,
    private _cookieService: CookieService,
    private _common: CommonService
  ) {
    new Fingerprint2().get((result) => this._guid = result);
    this.isLoggedIn((loggedIn: boolean) => {
      if (!loggedIn) {
        this.token = '';
        this.logout();
      }
    });
  }

  isLoggedIn(callback: any) {

    // Validate token
    if (!this._cookieService.get('token')) return callback(false);

    // Extract user
    try
    {
      this.token = this._cookieService.get('token');
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.loggedIn = true;
    }
    catch (ex)
    {
      callback(false);
    }

    // Get user from api
    this.fetchUser(callback);

  }

  fetchUser(callback: any) {

    // Fetch user
    this._http
      .get(`${this._config.apiURI}/users/authenticated`, this.headers())
      .map(res => res.json())
      .subscribe(
        (user) => {
          if (!user)
          {
            callback(false);
            return this.logout();
          }

          this.loggedIn = true;
          this.setUser(user);

          callback(true);
        },
        (err) => {
          this.logout();
          callback(false);
        }
      );

  }

  logout(callback: any = null) {
    callback = callback || (() => {});
    sessionStorage.removeItem('user');
    this.loggedIn = false;
    this.user = null;
    this._cookieService.remove('token');

    if (this.token) {
      this._http
        .get(`${this._config.apiURI}/users/logout?token=${this.token}`, this.headers())
        .subscribe(
          (ok) => callback(),
          (err) => callback()
        );
      this.token = '';
    }
  }

  login(username: string, password: string, remember: boolean, callback: any) {

    const promise = this._http
      .post(`${this._config.apiURI}/users/login`, { username: username, password: password, key: this._guid })
      .map(res => res.json());

    promise.subscribe(
      (response) => {
        if (!response.state) return callback(true, response.message || 'An error occurred.');

        this.token = response.token;
        this.loggedIn = true;
        this.setUser(response.user);

        if (remember)
        {
          const expires = new Date();
          expires.setSeconds(response.expiresIn);
          this._cookieService.put('token', response.token, { expires });
        }
        else this._cookieService.put('token', response.token);

        callback(false);
      },
      (error) => callback(true, error)
    );

  }

  setUser(user: User = null) {
    this.user = user || this.user;
    sessionStorage.setItem('user', JSON.stringify(this.user));
  }

  headers() {
    if (!this.token) return null;

    const headers = new Headers({
      'Authorization': `Bearer  ${this.token}`,
      'Content-Type': 'application/json'
    });

    return new RequestOptions({ headers: headers });
  }
}
