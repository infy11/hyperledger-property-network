import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedledgerComponent } from './sharedledger.component';

describe('SharedledgerComponent', () => {
  let component: SharedledgerComponent;
  let fixture: ComponentFixture<SharedledgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedledgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
