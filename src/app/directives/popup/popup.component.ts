import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
})
export class PopupComponent {
    @Input() wide: false;
    @Input() show: false;
    @Output() showChange: EventEmitter<String> = new EventEmitter<String>();

    constructor() {}

    hide() {
        this.show = false;
        this.showChange.emit();
    }
}
