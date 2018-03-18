import { Component, OnInit } from '@angular/core';
import * as PromptBoxes from 'prompt-boxes';


@Component({
  selector: 'app-project-prompt-boxes',
  templateUrl: './project-prompt-boxes.component.html',
  styleUrls: ['./project-prompt-boxes.component.css']
})
export class ProjectPromptBoxesComponent implements OnInit {
  private pb: any;

  constructor() {
    this.pb = new PromptBoxes();
  }

  success() {
    this.pb.success('This is an example success toast');
  }

  danger() {
    this.pb.error('This is an example error toast');
  }

  info() {
    this.pb.info('This is an example info toast');
  }

  confirm() {
    this.pb.confirm(
      (outcome) => { alert('You have: ' + (outcome ? 'confirmed' : 'cancelled')) }, // Callback
      'This is an example confirm', // Label text
      'Yes',                        // Confirm text
      'No'                          // Cancel text
    );
  }

  prompt() {
    this.pb.prompt(
      (value) => { alert('You have: ' + (value ? 'entered ' + value : 'cancelled')) }, // Callback
      'This is an example prompt',  // Label text
      'text',                       // Input type
      'Submit',                     // Submit text
      'Cancel'                      // Cancel text
    );
  }

  clear() {
    this.pb.clear();
  }

  ngOnInit() {
  }

}
