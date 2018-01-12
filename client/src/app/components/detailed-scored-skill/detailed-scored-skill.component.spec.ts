import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedScoredSkillComponent } from './detailed-scored-skill.component';

describe('DetailedScoredSkillComponent', () => {
  let component: DetailedScoredSkillComponent;
  let fixture: ComponentFixture<DetailedScoredSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedScoredSkillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedScoredSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
