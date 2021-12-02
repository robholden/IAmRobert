import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
    selector: 'app-cctv',
    templateUrl: 'cctv.component.html',
})
export class CCTVComponent implements OnInit {
    idleTime = 0;
    on = true;
    angle = 0;
    rotateAngle: SafeStyle;

    constructor(private _sanitizer: DomSanitizer) {
        setInterval(() => this.timerIncrement(), 1000);
    }

    timerIncrement() {
        if (this.idleTime > 3) {
            this.on = false;
        }

        if (this.idleTime === 0) {
            this.on = true;
        }

        this.idleTime += 1;
    }

    follow() {
        const posY = window.pageYOffset;
        const height = document.getElementsByTagName('body')[0].clientHeight;
        this.angle = posY / (height / 80);

        if (this.angle < -55) {
            this.angle = -55;
        }

        this.rotateAngle = this._sanitizer.bypassSecurityTrustStyle(`rotate(-${this.angle}deg)`);
    }

    @HostListener('document:mousemove', ['$event'])
    mouseMove(event: MouseEvent) {
        this.idleTime = 0;
    }

    @HostListener('document:scroll', ['$event'])
    scroll(event: MouseEvent) {
        this.follow();
        this.idleTime = 0;
    }

    ngOnInit() {}
}
