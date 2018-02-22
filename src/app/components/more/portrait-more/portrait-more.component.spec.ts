import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortraitMoreComponent } from './portrait-more.component';

describe('PortraitMoreComponent', () => {
  let component: PortraitMoreComponent;
  let fixture: ComponentFixture<PortraitMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortraitMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortraitMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
