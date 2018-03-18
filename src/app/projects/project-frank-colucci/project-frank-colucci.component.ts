import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-project-frank-colucci',
  templateUrl: './project-frank-colucci.component.html',
  styleUrls: ['./project-frank-colucci.component.css']
})
export class ProjectFrankColucciComponent implements OnInit {
  images: string[] = [
    '/assets/images/projects/frank-colucci/slide-1.jpg',
    '/assets/images/projects/frank-colucci/slide-2.jpg'
  ]

  constructor(private _title: Title) {
    this._title.setTitle(`Robert Holden » Frank Colucci`);
  }

  ngOnInit() {
  }

}