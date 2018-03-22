import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-project-snow-capture',
  templateUrl: './project-snow-capture.component.html',
  styleUrls: ['./project-snow-capture.component.css']
})
export class ProjectSnowCaptureComponent implements OnInit {
  images: string[] = [
    '/assets/images/projects/snow-capture/slide-1.jpg',
    '/assets/images/projects/snow-capture/slide-2.jpg'
  ]

  constructor(private _title: Title) {
    this._title.setTitle(`Robert Holden » Snow Capture`);
  }

  ngOnInit() {
  }

}
