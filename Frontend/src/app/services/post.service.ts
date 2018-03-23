import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AppConfig } from '../app.config';

import { AuthService } from './auth.service';

import { Post } from '../models/post';

@Injectable()
export class PostService {

  constructor(
    private _config: AppConfig,
    private _auth: AuthService,
    private _http: Http
  ) { }

  create(post: Post) {
    return this._http.post(`${this._config.apiURI}/posts`, post, this._auth.headers()).map(res => res.json());
  }

  get(slug: string) {
    return this._http.get(`${this._config.apiURI}/posts/${slug}`, this._auth.headers()).map(res => res.json());
  }

  update(post: Post) {
    return this._http.put(`${this._config.apiURI}/posts/${post.slug}`, post, this._auth.headers()).map(res => res.json());
  }

  delete(slug: string) {
    return this._http.delete(`${this._config.apiURI}/posts/${slug}`, this._auth.headers());
  }

  search(value: string, orderBy: string, orderDir: string, page: number) {
    const query = `value=${ value }&orderBy=${ orderBy }&orderDir=${ orderDir }&page=${ page }`;
    return this._http.get(`${ this._config.apiURI }/posts?${ query }`, this._auth.headers()).map(res => res.json());
  }
}
