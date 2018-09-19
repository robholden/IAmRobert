import { Component, OnInit } from '@angular/core';
import * as Selector from 'image-area-selector';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-project-image-area-selector',
  templateUrl: './project-image-area-selector.component.html',
  styleUrls: ['./project-image-area-selector.component.css']
})
export class ProjectImageAreaSelectorComponent implements OnInit {
  selector: any;

  constructor(private _title: Title) {
    this._title.setTitle(`Robert Holden » Image Area Selector`);
    this.selector = new Selector({
      imgId: 'img',
      onStart: (type, data) => {
        document.getElementById('preview').style.display = 'none';
      },
      onChange: (type, result) => { },
      onEnd: (type, data) => {
        const img: any = document.getElementById('preview');
        img.src = this.selector.crop();
        img.style.display = 'block';
      },
      className: '',
      keepAspect: true,
      minWidth: 100,
      maxWidth: 1000,
      minHeight: 100,
      maxHeight: 1000
    });
  }

  ngOnInit() {
    this.selector.setup(true);
  }

}
