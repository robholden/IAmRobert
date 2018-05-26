import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _tokenService: TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<HttpEventType.Response>> {
    var headers = this._tokenService.token ? { setHeaders: { Authorization: `Bearer ${this._tokenService.token}` } } : {};
    const authReq = req.clone(headers);
    return next.handle(authReq);
  }

}