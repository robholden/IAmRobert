import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import * as Selector from 'image-area-selector';

@Component({
  moduleId: module.id,
  selector: 'app-index',
  templateUrl: 'index.component.html',
  providers: []
})

export class IndexComponent implements OnInit {
  offset: SafeStyle;
  page: string;
  selector: any;

  constructor(
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _router: Router,
    private _title: Title,
    private _http: Http
  ) {
    this._route.data
      .subscribe(data => {
        const title = data.page ? data.page : 'Home';
        this._title.setTitle(`Robert Holden » ${title}`);
        this.page = data.page;
      });

    this.selector = new Selector({
      imgId: 'img',           // The id of the image to be used for selecting
      className: '',          // The image will be surrounded by a div, you can give that div a class name
      keepAspect: true,       // Allow any ratio, or keep the image ratio during resizing
      minWidth: 100,           // Minimum allowed width (native)
      maxWidth: 1000,          // Maximum allowed width (native)
      minHeight: 100,          // Minimum allowed height (native)
      maxHeight: 1000          // Maximum allowed height (native)
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

  @HostListener('window:resize', ['$event'])
  resize() {
    this.owl();
  }  

  owl() {
    var owlslide = document.getElementById('owl_slide');
    var owlcontent = document.getElementById('owl_content');
    var img = document.getElementById('img');

    if (img.clientHeight === 0) {
      setTimeout(() => this.owl(), 0);
      return;
    }

    if (img.clientHeight > owlslide.clientHeight) {
      owlslide.style.height = `${ img.clientHeight }px`;
      owlcontent.style.height = `${ img.clientHeight }px`;
    }
  }

  ngOnInit() {
    setTimeout(() => {      
      this.owl();
      this.selector.setup();
      document.getElementById('img').onclick = (event) => this.selector.show();
    }, 0);
  }
}
