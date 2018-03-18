import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPromptBoxesComponent } from './project-prompt-boxes.component';

describe('ProjectPromptBoxesComponent', () => {
  let component: ProjectPromptBoxesComponent;
  let fixture: ComponentFixture<ProjectPromptBoxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPromptBoxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPromptBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
