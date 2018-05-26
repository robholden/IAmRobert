import { Injectable } from '@angular/core';
import * as PromptBoxes from 'prompt-boxes';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  pb: any;

  /**
   * Creates an instance of ToastService.
   * @memberof ToastService
   */
  constructor() {
    this.pb = new PromptBoxes({ max: 5, promptAsAbsolute: true });
  }

  /**
   * Shows alert box
   *
   * @param {*} callback
   * @param {string} [msg='Are you sure?']
   * @param {string} [ok='Ok']
   * @memberof ToastService
   */
  alert(callback: any, msg: string, ok: string = 'Close'): void {
    this.pb.alert(callback, msg, ok);
  }

  /**
   * Shows a confirm alert box
   *
   * @param {*} callback
   * @param {string} [msg='Are you sure?']
   * @param {string} [yes='Yes']
   * @param {string} [no='Cancel']
   * @memberof ToastService
   */
  confirm(callback: any, msg: string = 'Are you sure?', yes: string = 'Yes', no: string = 'Cancel'): void {
    this.pb.confirm(callback, msg, yes, no);
  }

  /**
   * Show a prompt box
   *
   * @param {*} callback
   * @param {string} msg
   * @param {string} [type='text']
   * @param {string} [submit='Submit']
   * @param {string} [no='Cancel']
   * @memberof ToastService
   */
  prompt(callback: any, msg: string, type: string = 'text', submit: string = 'Submit', no: string = 'Cancel'): void {
    this.pb.prompt(callback, msg, type, submit, no);
  }

  /**
   * Show a success toast
   *
   * @param {string} msg
   * @memberof ToastService
   */
  success(msg: string): void {
    this.pb.success(msg);
  }

  /**
   * Show an error toast
   *
   * @param {string} msg
   * @memberof ToastService
   */
  error(msg: string): void {
    this.pb.error(msg);
  }

  /**
   * Shows an information toast
   *
   * @param {string} msg
   * @memberof ToastService
   */
  info(msg: string): void {
    this.pb.info(msg);
  }

  /**
   * Shows an error toast from a given server error
   *
   * @param {*} err
   * @memberof ToastService
   */
  serverError(err: any): void {
    const apiError = 'An API error has occurred';
    try
    {
      if (err.status > 0) this.pb.error(err.error || apiError);
      else this.pb.error(err || apiError);
    }
    catch (ex)
    {
      this.pb.error(err || apiError);
    }
  }
}
