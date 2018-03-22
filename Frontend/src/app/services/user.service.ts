import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { AppConfig } from '../app.config';

import { AuthService } from './auth.service';

import { User } from '../models/user';

@Injectable()
export class UserService {

  constructor(
    private _http: Http,
    private _config: AppConfig,
    private _auth: AuthService
  ) { }

  get(username: string) {
    return this._http.get(`${ this._config.apiURI }/users/${ username }`, this._auth.headers()).map(res => res.json());
  }

  update(user: User, password: string) {
    const setting: any = {
      user: user,
      password: password
    }

    return this._http.put(`${ this._config.apiURI }/users/${user.username}`, setting, this._auth.headers());
  }

  validToken(token: string, type: string) {
    return this._http.get(`${ this._config.apiURI }/users/validtoken?token=${ token }&type=${ type }`);
  }
}
