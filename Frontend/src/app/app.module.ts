import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { SlideshowModule } from 'ng-simple-slideshow';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';

import { NavComponent } from './directives/nav/nav.component';
import { CCTVComponent } from './directives/cctv/cctv.component';
import { ProjectComponent } from './directives/project/project.component';
import { CookieLawComponent } from './directives/cookie-law/cookie-law.component';
import { PopupComponent } from './directives/popup/popup.component';

import { IndexComponent } from './pages/index/index.component';
import { ProjectViewComponent } from './pages/projects/project-view/project-view.component';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { ProjectFrankColucciComponent } from './pages/projects/project-frank-colucci/project-frank-colucci.component';
import { ProjectSnowCaptureComponent } from './pages/projects/project-snow-capture/project-snow-capture.component';
import { ProjectImageAreaSelectorComponent } from './pages/projects/project-image-area-selector/project-image-area-selector.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectPromptBoxesComponent } from './pages/projects/project-prompt-boxes/project-prompt-boxes.component';
import { LoginComponent } from './pages/login/login.component';
import { AppConfig } from './app.config';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { CommonService } from './services/common.service';

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
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },

  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavComponent,
    CCTVComponent,
    ProjectComponent,
    ProjectViewComponent,
    ProjectListComponent,
    ProjectFrankColucciComponent,
    ProjectSnowCaptureComponent,
    ProjectImageAreaSelectorComponent,
    SkillsComponent,
    AboutComponent,
    ProjectPromptBoxesComponent,
    LoginComponent,
    CookieLawComponent,
    PopupComponent
  ],
  imports: [
    RouterModule.forRoot(routerConfig),
    BrowserModule,
    FormsModule,
    HttpModule,
    SlideshowModule
  ],
  providers: [Title, AuthGuard, AppConfig, CookieService, AuthService, CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
