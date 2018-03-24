import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

declare let require: any;
const SimpleMDE: any = require('simplemde');

@Component({
  selector: 'app-mdeditor',
  templateUrl: './mdeditor.component.html'
})
export class MdeditorComponent implements AfterViewInit {
  @Input() model: any;
  @Output() modelChange = new EventEmitter<string>();
  @ViewChild('simplemde') textarea: ElementRef;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    const modelChange = this.modelChange;
    const mde = new SimpleMDE({
      element: this.textarea.nativeElement
    });

    mde.codemirror.on('change', function() {
      const value = mde.codemirror.getValue();
      modelChange.emit(value);
    });

    if (this.model) {
      mde.codemirror.setValue(this.model);
    }
  }
}
