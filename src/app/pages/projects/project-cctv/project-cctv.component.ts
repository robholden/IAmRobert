import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-project-cctv',
    templateUrl: './project-cctv.component.html',
})
export class ProjectCCTVComponent implements OnInit {
    constructor(private _title: Title) {
        this._title.setTitle(`Robert Holden » CCTV`);
    }

    ngOnInit() {}
}
