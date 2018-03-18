import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSnowCaptureComponent } from './project-snow-capture.component';

describe('ProjectSnowCaptureComponent', () => {
  let component: ProjectSnowCaptureComponent;
  let fixture: ComponentFixture<ProjectSnowCaptureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSnowCaptureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSnowCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
