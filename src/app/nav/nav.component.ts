import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-nav',
  templateUrl: 'nav.component.html',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

export class NavComponent implements OnInit {
  @Input() routeRedirect: boolean = true;
  @Input() page: string;
  @Output() pageChange: EventEmitter<String> = new EventEmitter<String>();

  init = false;
  url = '';
  show = false;

  constructor(
    private _router: Router,
    private _location: Location
  ) { }

  goTo(page: string): void {
    if (this.routeRedirect) return this._router.navigate[(page)];

    this._location.go(`/${page === 'home' ? '' : page}`);
    this.page = page;
    this.pageChange.emit();

    this.scrollTo(page);
  }

  scrollTo(page: string, animate: boolean = true): void {
    const element = document.getElementById(page.toLowerCase());
    if (! element) {
      return;
    }

    if (animate) {
      window.scroll({
        top: element.offsetTop,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      window.scroll(0, element.offsetTop);
    }
  }

  @HostListener('document:scroll', ['$event'])
  scroll() {
    if (this.routeRedirect) return;

    const about = document.getElementById('skills');
    const offset = about.offsetTop;
    const scrollY = window.pageYOffset + 1;

    this.show = (offset < scrollY);
  }

  ngOnInit() {
    if (this.page && !this.routeRedirect) {
      this.scrollTo(this.page, false);
    }

    setTimeout(() => this.init = true, 250);
  }
}
