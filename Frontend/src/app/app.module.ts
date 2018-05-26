import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { SlideshowModule } from 'ng-simple-slideshow';
import { CookieModule } from 'ngx-cookie';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';

import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './guards/auth.interceptor';

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
import { LoginComponent } from './directives/login/login.component';
import { AppConfig } from './app.config';
import { AuthService } from './services/auth.service';
import { CommonService } from './services/common.service';
import { BlogPostsComponent } from './pages/blog/blog-posts/blog-posts.component';
import { BlogPostViewComponent } from './pages/blog/blog-post-view/blog-post-view.component';
import { BlogPostEditorComponent } from './pages/blog/blog-post-editor/blog-post-editor.component';
import { MdeditorComponent } from './directives/mdeditor/mdeditor.component';
import { MediaComponent } from './directives/media/media.component';

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
    path: 'blog',
    component: BlogPostsComponent,
    data: { title: 'Blog' }
  },
  {
    path: 'blog/post/edit/:slug',
    component: BlogPostEditorComponent,
    canActivate: [AuthGuard],
    data: { title: 'Post Editor' }
  },
  {
    path: 'blog/post/new',
    component: BlogPostEditorComponent,
    canActivate: [AuthGuard],
    data: { title: 'Post Editor' }
  },
  {
    path: 'blog/user/login',
    component: BlogPostsComponent,
    data: { title: 'Blog', goToLogin: true }
  },
  {
    path: 'blog/post/:slug',
    component: BlogPostViewComponent,
    data: { title: 'Post' }
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
    PopupComponent,
    BlogPostsComponent,
    BlogPostViewComponent,
    BlogPostEditorComponent,
    MdeditorComponent,
    MediaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    SlideshowModule,
    ClipboardModule,
    RouterModule.forRoot(routerConfig),
    CookieModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    Title,
    Meta
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
