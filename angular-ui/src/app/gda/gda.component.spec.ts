import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdaComponent } from './gda.component';

describe('GdaComponent', () => {
  let component: GdaComponent;
  let fixture: ComponentFixture<GdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
