import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectImageAreaSelectorComponent } from './project-image-area-selector.component';

describe('ProjectImageAreaSelectorComponent', () => {
  let component: ProjectImageAreaSelectorComponent;
  let fixture: ComponentFixture<ProjectImageAreaSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectImageAreaSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectImageAreaSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
