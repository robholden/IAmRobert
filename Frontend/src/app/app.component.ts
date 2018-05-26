import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class AppComponent {

  constructor(
    private _title: Title,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _meta: Meta,
    public auth: AuthService
  ) {
    _router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
      {

        // Get title from route data
        _title.setTitle(`Robert Holden » ${this.routeData('title', ' - ')}`);

        // Update meta tags
        const desc = this.routeData('description') || 'Robert Holden';
        const keywords = this.routeData('keywords', ', ');

        _meta.updateTag({ name: 'description', content: desc });
        _meta.updateTag({ name: 'keywords', content: `${keywords}` });

        window.scrollTo(0, 0);

      }
    });
  }

  login() {
    let ref = window.location.pathname;
    const invalid = ['login', 'register'];

    invalid.forEach(path => {
      if (ref.indexOf(path) > -1) ref = '/';
    });

    if (ref !== '/') this._router.navigate(['/login'], { queryParams: { ref } });
    else this._router.navigate(['/login']);
  }

  logout() {
    this.auth.logout((status, error) => location.reload());
  }

  routeData(prop, separator = '') {
    return this.getRouteData(prop).join(separator);
  }

  getRouteData(prop, parent: any = '') {
    const data = [];
    const state: any = this._router.routerState;

    if (parent === '')
    {
      parent = this._router.routerState.root;
    }

    if (parent && parent.snapshot.data && parent.snapshot.data[prop])
    {
      data.push(parent.snapshot.data[prop]);
    }

    if (state && parent)
    {
      data.push(... this.getRouteData(prop, state.firstChild(parent)));
    }

    return data;
  }
}
