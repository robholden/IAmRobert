import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() src: string = '';
  @Input() dir: string = 'left';

  constructor() { }

  ngOnInit() {
  }

}
