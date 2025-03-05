import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-project-scorecaddy',
    templateUrl: './project-scorecaddy.component.html',
    standalone: false,
})
export class ProjectScoreCaddyComponent {
    constructor(private _title: Title) {
        this._title.setTitle(`Robert Holden » Score Caddy`);
    }
}
