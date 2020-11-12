import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-project-view',
    templateUrl: './project-view.component.html'
})
export class ProjectViewComponent implements OnInit {
    private projects: string[] = ['image-area-selector', 'frank-colucci', 'prompt-boxes', 'cctv'];
    public project: string = '';

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this._route.params.subscribe((params) => {
            // Ensure the project is valid
            if (!params.project || this.projects.indexOf(params.project.toLowerCase()) === -1) return _router.navigate(['/projects']);

            // Set var to show
            this.project = params.project.toLowerCase();
        });
    }

    ngOnInit() {}
}
