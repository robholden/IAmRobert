import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-project-frank-colucci',
    templateUrl: './project-frank-colucci.component.html',
    standalone: false,
})
export class ProjectFrankColucciComponent {
    constructor(private _title: Title) {
        this._title.setTitle(`Robert Holden » Frank Colucci`);
    }
}
