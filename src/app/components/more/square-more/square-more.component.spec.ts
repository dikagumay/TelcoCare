import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareMoreComponent } from './square-more.component';

describe('SquareMoreComponent', () => {
  let component: SquareMoreComponent;
  let fixture: ComponentFixture<SquareMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
