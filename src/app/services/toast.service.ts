import { Injectable } from '@angular/core';
import * as PromptBoxes from 'prompt-boxes';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private pb: any;

    /**
     * Creates an instance of ToastService.
     * @memberof ToastService
     */
    constructor() {
        this.pb = new PromptBoxes({
            attrPrefix: 'pb',
            speeds: {
                backdrop: 250,  // The enter/leaving animation speed of the backdrop
                toasts: 250     // The enter/leaving animation speed of the toast
            },
            alert: {
                okText: 'Ok',           // The text for the ok button
                okClass: '',            // A class for the ok button
                closeWithEscape: false, // Allow closing with escaping
                absolute: false         // Show prompt popup as absolute
            },
            confirm: {
                confirmText: 'Confirm', // The text for the confirm button
                confirmClass: '',       // A class for the confirm button
                cancelText: 'Cancel',   // The text for the cancel button
                cancelClass: '',        // A class for the cancel button
                closeWithEscape: true,  // Allow closing with escaping
                absolute: false         // Show prompt popup as absolute
            },
            prompt: {
                inputType: 'text',      // The type of input 'text' | 'password' etc.
                submitText: 'Submit',   // The text for the submit button
                submitClass: '',        // A class for the submit button
                cancelText: 'Cancel',   // The text for the cancel button
                cancelClass: '',        // A class for the cancel button
                closeWithEscape: true,  // Allow closing with escaping
                absolute: false         // Show prompt popup as absolute
            },
            toasts: {
                direction: 'top',       // Which direction to show the toast  'top' | 'bottom'
                max: 5,                 // The number of toasts that can be in the stack
                duration: 4000,         // The time the toast appears
                showTimerBar: true,     // Show timer bar countdown
                allowClose: true        // Whether to show a "x" to close the toast
            }
        });
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
     * Shows an information toast
     *
     * @param {string} msg
     * @param {number} [duration=null]
     * @memberof ToastService
     */
    info(msg: string, duration: number = null): void {
        this.pb.info(msg, duration !== null ? { duration } : {});
    }

    /**
     * Show a success toast
     *
     * @param {string} msg
     * @param {number} [duration=null]
     * @memberof ToastService
     */
    success(msg: string, duration: number = null): void {
        this.pb.success(msg, duration !== null ? { duration } : {});
    }

    /**
     * Show an error toast
     *
     * @param {*} error
     * @param {number} [duration=null]
     * @memberof ToastService
     */
    error(error: any, duration: number = null): void {
        this.pb.error(error.message || error, duration !== null ? { duration } : {});
    }

    /**
     * Clears instances
     *
     * @memberof ToastService
     */
    clear() {
        this.pb.clear();
    }

    /**
     * Shows an error toast from a given server error
     *
     * @param {*} err
     * @memberof ToastService
     */
    serverError(err: any, duration: number = null): void {
        const apiError = 'An API error has occurred';
        try {
            if (err.status > 0) this.pb.error(err.error || apiError, duration);
            else this.pb.error(err || apiError);
        }
        catch (ex) {
            this.pb.error(err || apiError, duration);
        }
    }
}
