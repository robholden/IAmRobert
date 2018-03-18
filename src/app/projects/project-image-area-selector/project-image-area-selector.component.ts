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
      imgId: 'img',           // The id of the image to be used for selecting
      className: '',          // The image will be surrounded by a div, you can give that div a class name
      keepAspect: true,       // Allow any ratio, or keep the image ratio during resizing
      minWidth: 100,           // Minimum allowed width (native)
      maxWidth: 1000,          // Maximum allowed width (native)
      minHeight: 100,          // Minimum allowed height (native)
      maxHeight: 1000          // Maximum allowed height (native)
    });
  }

  ngOnInit() {
    setTimeout(() => this.selector.setup().show(), 100);
  }

}
