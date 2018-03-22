import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie';

declare let ga: any;

@Injectable()
export class CommonService {
  cookiesEnabled = true;
  doNotTrack = false;

  constructor(private _cookieService: CookieService) {

    // Run can store cookie method
    this.cookiesEnabled = this.canStoreCookies();

    // Set do not track property
    if (navigator && ((navigator as any).doNotTrack || '') !== '')
    {
      const noTrack = (navigator as any).doNotTrack;
      this.doNotTrack = noTrack === 'yes' || noTrack === '1';
    }

  }

  onUnload() {
    this.canStoreCookies();
    localStorage.clear();
  }

  loadGoogleAnalytics() {

    // Don't load analytics if they don't want to be tracked :)
    if (!this.cookiesEnabled || this.doNotTrack || !environment.GAtrackingId) return;

    const gaNewElem: any = {};
    const gaElems: any = {};
    const currdate: any = new Date();

    /* tslint:disable:no-string-literal */
    /* tslint:disable:semicolon */
    /* tslint:disable:no-unused-expression */
    // This code is from Google, so let's not modify it too much, just add gaNewElem and gaElems:
    (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * currdate; a = s.createElement(o),
      m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga', gaNewElem, gaElems);
    /* tslint:enable:no-unused-expression */
    /* tslint:enable:semicolon */
    /* tslint:enable:no-string-literal */

    ga('create', environment.GAtrackingId, 'auto');
    ga('send', 'pageview');

  }

  enableCookies() {
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    this._cookieService.put('cookieLawSeen', 'true', { expires });
    this.cookiesEnabled = true;
  }

  disableCookies() {
    this._cookieService.remove('cookieLawSeen');
    this.cookiesEnabled = false;
    this.canStoreCookies();
  }

  canStoreCookies() {
    const law = this._cookieService.get('cookieLawSeen');
    if (! law || law !== 'true')
    {
      const cookies = this._cookieService.getAll();
      const allowed = ['token'];
      for (let cookie in cookies)
      {
        if (allowed.indexOf(cookie) > -1) continue;
        this._cookieService.remove(cookie);
      }
      return false;
    }

    return true;
  }

  loadScript(dynamicScripts: { name: string, attrs: string[] }[]) {
    let isFound = false;
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; ++i)
    {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes('loader'))
      {
        isFound = true;
      }
    }

    if (!isFound) {
      for (let i = 0; i < dynamicScripts.length; i++)
      {
        const node = document.createElement('script');
        node.src = dynamicScripts[i].name;
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        dynamicScripts[i].attrs.forEach((val) => node.setAttribute(val, null));
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
  }
}
