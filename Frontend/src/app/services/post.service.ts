import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppConfig } from '../app.config';

import { AuthService } from './auth.service';

import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  /**
   * Creates an instance of PostService.
   * 
   * @param {AppConfig} _config 
   * @param {AuthService} _auth 
   * @param {HttpClient} _http 
   * @memberof PostService
   */
  constructor(
    private _config: AppConfig,
    private _auth: AuthService,
    private _http: HttpClient
  ) { }

  /**
   * Creates a new post
   * 
   * @param {Post} post 
   * @returns {Observable<Post>} 
   * @memberof PostService
   */
  create(post: Post): Observable<Post> {
    return this._http.post<Post>(`${this._config.apiURI}/posts`, post);
  }

  /**
   *  Gets a post by its slug 
   * 
   * @param {string} slug 
   * @returns {Observable<Post>} 
   * @memberof PostService
   */
  get(slug: string): Observable<Post> {
    return this._http.get<Post>(`${this._config.apiURI}/posts/${slug}`);
  }

  /**
   * Updates a post
   * 
   * @param {string} slug 
   * @param {Post} post 
   * @returns {Observable<Post>} 
   * @memberof PostService
   */
  update(slug: string, post: Post): Observable<Post> {
    return this._http.put<Post>(`${this._config.apiURI}/posts/${slug}`, post);
  }

  /**
   * Deletes a post
   * 
   * @param {string} slug 
   * @returns {Observable<any>} 
   * @memberof PostService
   */
  delete(slug: string): Observable<any> {
    return this._http.delete<any>(`${this._config.apiURI}/posts/${slug}`);
  }

  /**
   * Searches posts with given criteria
   * 
   * @param {string} value 
   * @param {string} orderBy 
   * @param {string} orderDir 
   * @param {number} page 
   * @returns {Observable<Post[]>} 
   * @memberof PostService
   */
  search(value: string, orderBy: string, orderDir: string, page: number): Observable<Post[]> {
    const query = `value=${value}&orderBy=${orderBy}&orderDir=${orderDir}&page=${page}`;
    return this._http.get<Post[]>(`${this._config.apiURI}/posts?${query}`);
  }
}
