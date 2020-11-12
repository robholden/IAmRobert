import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CCTVComponent } from './directives/cctv/cctv.component';
import { NavComponent } from './directives/nav/nav.component';
import { PopupComponent } from './directives/popup/popup.component';
import { ProjectComponent } from './directives/project/project.component';
import { AboutComponent } from './pages/about/about.component';
import { IndexComponent } from './pages/index/index.component';
import { ProjectCCTVComponent } from './pages/projects/project-cctv/project-cctv.component';
import { ProjectFrankColucciComponent } from './pages/projects/project-frank-colucci/project-frank-colucci.component';
import { ProjectImageAreaSelectorComponent } from './pages/projects/project-image-area-selector/project-image-area-selector.component';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { ProjectPromptBoxesComponent } from './pages/projects/project-prompt-boxes/project-prompt-boxes.component';
import { ProjectViewComponent } from './pages/projects/project-view/project-view.component';
import { SkillsComponent } from './pages/skills/skills.component';

import { SlideshowModule } from 'ng-simple-slideshow';
import { ClipboardModule } from 'ngx-clipboard';

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
        AppComponent,
        IndexComponent,
        NavComponent,
        CCTVComponent,
        ProjectComponent,
        ProjectViewComponent,
        ProjectListComponent,
        ProjectFrankColucciComponent,
        ProjectImageAreaSelectorComponent,
        SkillsComponent,
        AboutComponent,
        ProjectPromptBoxesComponent,
        ProjectCCTVComponent,
        PopupComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        HttpClientModule,
        SlideshowModule,
        ClipboardModule,
        RouterModule.forRoot(routerConfig)
    ],
    providers: [Title, Meta],
    bootstrap: [AppComponent]
})
export class AppModule {}
