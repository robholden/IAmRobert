import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { GlobalVariables } from '../variables/variables.global';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';
import { IndexComponent } from '../pages/index/index.component';
import { NavComponent } from '../pages/nav/nav.component';

import { CCTVComponent } from '../pages/cctv/cctv.component';
import { LoadingComponent } from '../pages/loading/loading.component';

// enableProdMode();

export const routerConfig: Routes = [
    {
        path: '',
        component: IndexComponent,
        data: { page: 'Home' }
    },
    {
        path: 'about',
        component: IndexComponent,
        data: { page: 'About' }
    },
    {
        path: 'blog',
        component: IndexComponent,
        data: { page: 'Blog' }
    },
    {
        path: 'blog/:post',
        component: IndexComponent,
        data: { page: 'Blog' }
    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
    }
];

@NgModule({
  declarations: [
      AppComponent, IndexComponent, NavComponent, LoadingComponent, CCTVComponent
  ],
  imports: [
    RouterModule.forRoot(routerConfig),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [CookieService, GlobalVariables, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
