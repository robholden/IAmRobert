import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { NavComponent } from './nav/nav.component';

import { CCTVComponent } from './cctv/cctv.component';
import { LoadingComponent } from './loading/loading.component';

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
        path: 'projects',
        component: IndexComponent,
        data: { page: 'Projects' }
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
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
