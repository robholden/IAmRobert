import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'app-index',
  templateUrl: 'index.component.html',
  providers: []
})

export class IndexComponent implements OnInit {
  offset: SafeStyle;
  page: string;

  constructor(
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _router: Router,
    private _title: Title,
    private _http: Http
  ) {
    this._route.data
      .subscribe(data => {
        this.page = data.title ? data.title.toLowerCase() : 'home';
        this._title.setTitle(`Robert Holden » ${this.page}`);
      });
  }

  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (! element) {
      return;
    }

    window.scroll({
      top: element.offsetTop,
      left: 0,
      behavior: 'smooth'
    });
  }

  @HostListener('document:scroll', ['$event'])
  scroll() {
    const wH = window.innerHeight;
    const scrollY = window.pageYOffset;
    const val = scrollY / 2.5;
    const milestones = document.getElementsByClassName('milestone');

    this.offset = this._sanitizer.bypassSecurityTrustStyle(`translateY(${val}px)`);

    for (let i = 0; i < milestones.length; i++) {
      const el = milestones[i];
      const x = el.getBoundingClientRect().top;

      if (x < (wH - 100)) {
        if (el.className.indexOf('in-view') === -1) {
          el.className = el.className + ' in-view';
        }
      } else {
        el.className = el.className.replace('in-view', '');
      }
    }
  }

  ngOnInit() {
  }
}
