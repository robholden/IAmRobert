import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AppConfig } from '../../app.config';
import { FileService } from '../../services/file.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {
  loading = true;
  files: string[] = [];
  fileToUpload: File;
  progress = -1;
  @ViewChild('uploadField') uploadField: any;

  constructor(
    public config: AppConfig,
    private _router: Router,
    private _fileService: FileService,
    private _toast: ToastService
  ) {
    this.get();
  }

  get() {
    this._fileService.all()
      .subscribe(
        (files) => {
          this.files = files;
          this.loading = false;
        }
      );
  }

  delete(path: string) {
    this._toast.confirm(
      (ok) => {
        if (!ok) return;

        this._fileService.delete(path).subscribe(
          (ok) => {
            this._toast.success('File has been deleted');
            this.get();
          },
          (error) => this._toast.serverError(error)
        );
      },
      'Are you sure you want to delete this file?',
      'Delete',
      'Cancel'
    )
  }

  upload(fileInput: any) {

    // Ensure there's a picture to upload!
    this.fileToUpload = fileInput.target.files[0];
    if (!this.fileToUpload) return this._toast.error('Please upload a file');

    const clear = (error: any = null) => {
      this.progress = -1;
      this.fileToUpload = null;
      this.uploadField.nativeElement.value = '';

      if (error !== null) this._toast.serverError(error);
      else
      {
        this._toast.success('File uploaded successfully');
        this.get();
      }
    };

    this.progress = 0;
    this._fileService
      .upload(this.fileToUpload, (n) => this.progress = n)
      .then(
        (result: any) => clear(),
        (error) => clear(error)
      )
      .catch((error) => clear(error));
  }

  copied() {
    this._toast.success('File path has been copied to clipboard');
  }

  ngOnInit() {
  }

}
