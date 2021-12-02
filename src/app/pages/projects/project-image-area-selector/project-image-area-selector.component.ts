import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import * as Selector from 'image-area-selector';

@Component({
    selector: 'app-project-image-area-selector',
    templateUrl: './project-image-area-selector.component.html',
})
export class ProjectImageAreaSelectorComponent implements OnInit {
    selector: any;

    constructor(private _title: Title) {
        this._title.setTitle(`Robert Holden » Image Area Selector`);
    }

    ngOnInit() {
        setTimeout(() => this.load(), 0);
    }

    private load() {
        this.selector = new Selector({
            imgId: 'img',
            onStart: (type, data) => {
                document.getElementById('preview').style.display = 'none';
            },
            onChange: (e) => {},
            onEnd: (e) => {
                const img: any = document.getElementById('preview');
                img.src = this.selector.crop();
                img.style.display = 'block';
            },
            className: '',
            keepAspect: true,
            minWidth: 100,
            maxWidth: 1000,
            minHeight: 100,
            maxHeight: 1000,
        });

        this.selector.setup(true);
    }
}
