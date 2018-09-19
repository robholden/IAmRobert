import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfig {
  public baseURI = environment.endPoint;
  public apiURI = `${this.baseURI}/v1`;
  public fileURI = `${this.baseURI}/uploads`;
  public siteUrl = environment.siteUrl;
  public siteTitle = 'Robert Holden';
  public GAtrackingId = environment.GAtrackingId;

  constructor() { }
}
