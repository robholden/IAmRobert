import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie'
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private _token: string = '';

  /**
   * Creates an instance of TokenService.
   *
   * @memberof TokenService
   */
  constructor(
    private _cookieService: CookieService,
    private _common: CommonService
  ) {
    this._token = this._cookieService.get('token') || '';
  }

  /**
   * Sets the token value
   * 
   * @memberof AuthService
   */
  setToken(value: string, expiresIn: number = 0) {
    let expires: Date = null;
    if (expiresIn > 0 && this._common.cookiesEnabled)
    {
      expires = new Date();
      expires.setSeconds(expiresIn);
    }

    this._cookieService.put('token', value, { expires });
    this.token = value;
  }

  removeToken() {
    this._cookieService.remove('token');
    this.token = '';
  }

  /**
   * Sets token value
   * 
   * @memberof TokenService
   */
  set token(value: string) {
    this._token = value;
  }

  /**
   * Returns token value
   * 
   * @type {string}
   * @memberof AuthService
   */
  get token(): string {
    return this._token;
  }

}
