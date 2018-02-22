import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerMoreComponent } from './banner-more.component';

describe('BannerMoreComponent', () => {
  let component: BannerMoreComponent;
  let fixture: ComponentFixture<BannerMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
