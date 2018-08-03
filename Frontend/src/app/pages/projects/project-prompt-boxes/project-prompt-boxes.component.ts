import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-project-prompt-boxes',
  templateUrl: './project-prompt-boxes.component.html',
  styleUrls: ['./project-prompt-boxes.component.css']
})
export class ProjectPromptBoxesComponent implements OnInit {

  constructor(private _title: Title, private _toast: ToastService) {
    this._title.setTitle(`Robert Holden » Prompt Boxes`);
  }

  permanent() {
    this._toast.info('This is a permanent toast', 0)
  }

  success() {
    this._toast.success('This is an example success toast');
  }

  danger() {
    this._toast.error('This is an example error toast');
  }

  info() {
    this._toast.info('This is an example info toast');
  }

  alert() {
    this._toast.alert(
      (outcome) => { alert('You have: ' + (outcome ? 'confirmed' : 'cancelled')) }, // Callback
      'This is an example alert',  // Label text
      'Ok',                        // Confirm text
    );
  }

  confirm() {
    this._toast.confirm(
      (outcome) => { alert('You have: ' + (outcome ? 'confirmed' : 'cancelled')) }, // Callback
      'This is an example confirm', // Label text
      'Yes',                        // Confirm text
      'No'                          // Cancel text
    );
  }

  prompt() {
    this._toast.prompt(
      (value) => { alert('You have: ' + (value ? 'entered ' + value : 'cancelled')) }, // Callback
      'This is an example prompt',  // Label text
      'text',                       // Input type
      'Submit',                     // Submit text
      'Cancel'                      // Cancel text
    );
  }

  clear() {
    this._toast.clear();
  }

  ngOnInit() {
  }

}
