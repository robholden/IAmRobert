import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as PromptBoxes from 'prompt-boxes';

@Component({
  selector: 'app-project-prompt-boxes',
  templateUrl: './project-prompt-boxes.component.html',
  styleUrls: ['./project-prompt-boxes.component.css']
})
export class ProjectPromptBoxesComponent implements OnInit {
  private pb: any;

  constructor(private _title: Title) {
    this._title.setTitle(`Robert Holden » Prompt Boxes`);
    this.pb = new PromptBoxes();
  }

  permanent() {
    this.pb.info('This is a permanent toast', { duration: 0, showClose: true })
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

  alert() {
    this.pb.alert(
      (outcome) => { alert('You have: ' + (outcome ? 'confirmed' : 'cancelled')) }, // Callback
      'This is an example alert', // Label text
      'Ok',                        // Confirm text
    );
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
