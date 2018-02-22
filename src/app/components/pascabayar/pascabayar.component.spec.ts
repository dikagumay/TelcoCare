import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PascabayarComponent } from './pascabayar.component';

describe('PascabayarComponent', () => {
  let component: PascabayarComponent;
  let fixture: ComponentFixture<PascabayarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PascabayarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PascabayarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
