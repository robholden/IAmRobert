import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(
    private _title: Title,
    private _router: Router,
    private _meta: Meta,
  ) {
    _router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
      {

        // Get title from route data
        this._title.setTitle(`Robert Holden » ${this.routeData('title', ' - ')}`);

        // Update meta tags
        const desc = this.routeData('description') || 'Robert Holden';
        const keywords = this.routeData('keywords', ', ');

        this._meta.updateTag({ name: 'description', content: desc });
        this._meta.updateTag({ name: 'keywords', content: `${keywords}` });

        window.scrollTo(0, 0);

      }
    });
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
