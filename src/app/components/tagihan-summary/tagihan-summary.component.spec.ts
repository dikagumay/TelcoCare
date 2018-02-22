import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagihanSummaryComponent } from './tagihan-summary.component';

describe('TagihanSummaryComponent', () => {
  let component: TagihanSummaryComponent;
  let fixture: ComponentFixture<TagihanSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagihanSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagihanSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
