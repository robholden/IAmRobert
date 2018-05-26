import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppConfig } from '../../app.config';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  ref: string = '';
  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;
  remember: boolean = false;
  code: string = '';

  @Input() show: false;
  @Output() showChange: EventEmitter<String> = new EventEmitter<String>();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _toast: ToastService,
    public auth: AuthService,
    public common: CommonService
  ) {

    // Store referrer url
    this._route.queryParams.subscribe(params => this.ref = (params['ref'] || '').replace(/%20/g, ' '));

    // Are they already logged in?
    if (this.auth.loggedIn) this._router.navigate(['/']);

  }

  login() {

    // Begin login process
    this.loading = true;
    this.auth.login(
      this.username,
      this.password,
      this.remember,
      () => this.ref ? this._router.navigate([this.ref]) : this._router.navigate(['/']),
      (error: string) => {
        this.loading = false;
        this.password = '';
        this.error = error;
        document.getElementById('login-password').focus();
      }
    );
  }

  ngOnInit() {
  }

}
