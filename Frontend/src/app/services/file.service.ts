import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AppConfig } from '../app.config';

import { AuthService } from './auth.service';

@Injectable()
export class FileService {

  constructor(
    private _config: AppConfig,
    private _auth: AuthService,
    private _http: Http
  ) { }

  all() {
    return this._http.get(`${this._config.apiURI}/files`, this._auth.headers()).map(res => res.json());
  }

  delete(name: string) {
    return this._http.delete(`${this._config.apiURI}/files/${name}`, this._auth.headers());
  }

  upload(file: File, progress: any) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      formData.append('files', file, file.name);

      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) try { resolve(JSON.parse(xhr.response)); } catch { resolve(); }
          else reject(xhr.response);
        }
      };

      if (progress) {
        xhr.upload.addEventListener('progress', function (ev) {
          let n = Math.ceil(ev.loaded / (ev.total / 100));
          n = n > 100 ? 100 : n;
          progress(n);
        }, false);
      }

      xhr.open('POST', `${this._config.apiURI}/files`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${this._auth.token}`);
      xhr.setRequestHeader('enctype', 'multipart/form-data');
      xhr.send(formData);
    });
  }
}
