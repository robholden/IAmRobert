import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

declare let ga: any;

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  cookiesEnabled = true;
  doNotTrack = false;

  /**
   * Creates an instance of CommonService.
   * 
   * @param {CookieService} _cookieService 
   * @memberof CommonService
   */
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

  /**
   * Resets dom elements 
   * 
   * @memberof CommonService
   */
  resetDom() {

    // Close popups
    const pToggle: HTMLElement = document.querySelector('.open .popup-close') as HTMLElement;
    if (pToggle) pToggle.click();

    // Allow overflow
    const body: HTMLElement = document.querySelector('body') as HTMLElement;
    body.style.overflow = "auto";
    body.click();

  }

  /**
   * Runs logic when unloading page
   * 
   * @memberof CommonService
   */
  onUnload() {
    this.canStoreCookies();
    // sessionStorage.clear();
  }

  /**
   * Adds Google Analytics to the page
   * 
   * @memberof CommonService
   */
  loadGoogleAnalytics(): void {

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

  /**
   * Adds a cookie flag to say the client has accepted cookies 
   * 
   * @memberof CommonService
   */
  enableCookies(): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    this._cookieService.put('cookieLawSeen', 'true', { expires });
    this.cookiesEnabled = true;
  }

  /**
   * Removes the cookie flag and run disable script
   * 
   * @memberof CommonService
   */
  disableCookies(): void {
    this._cookieService.remove('cookieLawSeen');
    this.cookiesEnabled = false;
    this.canStoreCookies();
  }

  /**
   * Returns whether the client has accepted cookies
   * 
   * @returns {boolean} 
   * @memberof CommonService
   */
  canStoreCookies(): boolean {
    const law = this._cookieService.get('cookieLawSeen');
    if (!law || law !== 'true')
    {
      const cookies = this._cookieService.getAll();
      const allowed = ['token'];
      for (const cookie in cookies)
      {
        if (allowed.indexOf(cookie) > -1) continue;
        this._cookieService.remove(cookie);
      }
      return false;
    }

    return true;
  }

  /**
   * Returns whether a given string if of a given strength
   * 
   * @param {string} pw 
   * @param {number} [level=0] 
   * @returns {boolean}
   * @memberof CommonService
   */
  isSecure(pw: string, level = 0): boolean {
    if (!pw) return true;

    const length = pw.length >= 8;
    const lower = pw.match(/[a-z]/) !== null;
    const upper = pw.match(/[A-Z]/) !== null;
    const number = pw.match(/\d/) !== null;
    // const special = pw.match(/[`\[\{\}\]\¬\!\"\£\$\%\^\&\*\(\)\-\_\=\+\,\<\.\>\/\?\|\\]/);
    const password = pw.search('password') > -1;

    switch (level)
    {
      case 1:
        return length;
      case 2:
        return lower && upper;
      case 3:
        return number;
      case 0:
        return (length && lower && upper && number && !password);
    }
  }

  /**
   * Loads a single script
   * 
   * @param {string} url 
   * @memberof CommonService
   */
  loadScript(url: string) {
    this.loadScripts([{ name: url, attrs: [] }]);
  }

  /**
   * Loads a script async 
   * 
   * @param {{ name: string, attrs: string[] }[]} dynamicScripts 
   * @memberof CommonService
   */
  loadScripts(dynamicScripts: { name: string, attrs: string[] }[]): void {
    let isFound = false;
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; ++i)
    {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes('loader'))
      {
        isFound = true;
      }
    }

    if (!isFound)
    {
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
