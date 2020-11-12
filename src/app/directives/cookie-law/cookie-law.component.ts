import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-cookie-law',
    templateUrl: './cookie-law.component.html'
})
export class CookieLawComponent implements OnInit {
    constructor(public common: CommonService) {}

    ngOnInit() {}

    accept() {
        this.common.enableCookies();
        // location.reload();
    }
}
