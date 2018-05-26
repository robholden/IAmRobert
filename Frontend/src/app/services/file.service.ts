import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppConfig } from '../app.config';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  /**
   * Creates an instance of FileService.
   * 
   * @param {AppConfig} _config 
   * @param {TokenService} _tokenService 
   * @param {HttpClient} _http 
   * @memberof FileService
   */
  constructor(
    private _config: AppConfig,
    private _tokenService: TokenService,
    private _http: HttpClient
  ) { }

  /**
   * Returns all media files
   * 
   * @returns {Observable<string[]>} 
   * @memberof FileService
   */
  all(): Observable<string[]> {
    return this._http.get<string[]>(`${this._config.apiURI}/files`);
  }

  /**
   * Deletes a media file by a given name
   * 
   * @param {string} name 
   * @returns {Oberservable<any>} 
   * @memberof FileService
   */
  delete(name: string): Observable<any> {
    return this._http.delete<any>(`${this._config.apiURI}/files/${name}`);
  }

  /**
   * Uploads a media file to the server
   * 
   * @param {File} file 
   * @param {*} progress 
   * @returns {*} 
   * @memberof FileService
   */
  upload(file: File, progress: any): any {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      formData.append('files', file, file.name);

      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4)
        {
          if (xhr.status === 200) try { resolve(JSON.parse(xhr.response)); } catch { resolve(); }
          else reject(xhr.response);
        }
      };

      if (progress)
      {
        xhr.upload.addEventListener('progress', function (ev) {
          let n = Math.ceil(ev.loaded / (ev.total / 100));
          n = n > 100 ? 100 : n;
          progress(n);
        }, false);
      }

      xhr.open('POST', `${this._config.apiURI}/files`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${this._tokenService.token}`);
      xhr.setRequestHeader('enctype', 'multipart/form-data');
      xhr.send(formData);
    });
  }
}
