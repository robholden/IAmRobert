import { Injectable } from '@angular/core';
import * as PromptBoxes from 'prompt-boxes';

@Injectable()
export class ToastService {
  private pb: any;

  constructor() {
    this.pb = new PromptBoxes({ max: 5, promptAsAbsolute: true });
  }

  alert(callback: any, msg: string, ok: string = 'Close'): void {
    this.pb.alert(callback, msg, ok);
  }

  confirm(callback: any, msg: string = 'Are you sure?', yes: string = 'Yes', no: string = 'Cancel') {
    this.pb.confirm(callback, msg, yes, no);
  }

  prompt(callback: any, msg: string, type: string = 'text', submit: string = 'Submit', no: string = 'Cancel') {
    this.pb.prompt(callback, msg, type, submit, no);
  }

  success(msg: string) {
    this.pb.success(msg);
  }

  error(msg: string) {
    this.pb.error(msg);
  }

  info(msg: string) {
    this.pb.info(msg);
  }

  serverError(err: any) {
    try
    {
      if (err.status > 0)
      {
        this.pb.error(err._body || 'An API error occurred');
      } else
      {
        this.pb.error('An API error occurred');
      }
    } catch (ex)
    {
      this.pb.error('An API error occurred');
    }
  }
}
