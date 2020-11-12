import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {
    @Input() id: string = '';
    @Input() name: string = '';
    @Input() src: string = '';
    @Input() dir: string = 'left';

    constructor() {}

    ngOnInit() {}
}
