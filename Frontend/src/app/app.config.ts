import { environment } from '../environments/environment';

export class AppConfig {
  public baseURI = environment.endPoint;
  public apiURI = `${ this.baseURI }/v1`;
  public siteUrl = environment.siteUrl;
  public siteTitle = 'Robert Holden';
  public GAtrackingId = environment.GAtrackingId;

  constructor() {}
}
