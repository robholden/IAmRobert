import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { SlideshowModule } from 'ng-simple-slideshow';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { NavComponent } from './nav/nav.component';

import { CCTVComponent } from './_directives/cctv/cctv.component';
import { LoadingComponent } from './loading/loading.component';
import { ProjectComponent } from './_directives/project/project.component';
import { ProjectViewComponent } from './projects/project-view/project-view.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectFrankColucciComponent } from './projects/project-frank-colucci/project-frank-colucci.component';
import { ProjectSnowCaptureComponent } from './projects/project-snow-capture/project-snow-capture.component';
import { ProjectImageAreaSelectorComponent } from './projects/project-image-area-selector/project-image-area-selector.component';

export const routerConfig: Routes = [
  {
    path: '',
    component: IndexComponent,
    data: { title: 'Home' }
  },
  {
    path: 'about',
    component: IndexComponent,
    data: { title: 'About' }
  },
  {
    path: 'projects',
    component: IndexComponent,
    data: { title: 'Projects' }
  },
  {
    path: 'skills',
    component: IndexComponent,
    data: { title: 'Skills' }
  },
  {
    path: 'projects/:project',
    component: ProjectViewComponent,
    data: { title: 'Project' }
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent, IndexComponent, NavComponent, LoadingComponent, CCTVComponent, ProjectComponent, ProjectViewComponent, ProjectListComponent, ProjectFrankColucciComponent, ProjectSnowCaptureComponent, ProjectImageAreaSelectorComponent
  ],
  imports: [
    RouterModule.forRoot(routerConfig),
    BrowserModule,
    FormsModule,
    HttpModule,
    SlideshowModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
