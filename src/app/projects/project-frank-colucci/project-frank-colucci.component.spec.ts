import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFrankColucciComponent } from './project-frank-colucci.component';

describe('ProjectFrankColucciComponent', () => {
  let component: ProjectFrankColucciComponent;
  let fixture: ComponentFixture<ProjectFrankColucciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFrankColucciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFrankColucciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
