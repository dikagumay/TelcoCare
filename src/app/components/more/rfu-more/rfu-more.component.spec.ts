import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfuMoreComponent } from './rfu-more.component';

describe('RfuMoreComponent', () => {
  let component: RfuMoreComponent;
  let fixture: ComponentFixture<RfuMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfuMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfuMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
