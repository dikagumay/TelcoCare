import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingCreditComponent } from './remaining-credit.component';

describe('RemainingCreditComponent', () => {
  let component: RemainingCreditComponent;
  let fixture: ComponentFixture<RemainingCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemainingCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainingCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
