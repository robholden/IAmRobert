import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  private projects: string[] = ['snow-capture', 'image-area-selector', 'frank-colucci'];
  public project: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._route.params.subscribe(params => {

      // Ensure the project is valid
      if (!params.project || this.projects.indexOf(params.project.toLowerCase()) == -1)
        return _router.navigate(['/projects']);

      // Set var to show
      this.project = params.project.toLowerCase();

    })
  }

  ngOnInit() {
  }

}
