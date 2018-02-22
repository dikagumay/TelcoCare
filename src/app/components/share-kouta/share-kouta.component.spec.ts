import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareKoutaComponent } from './share-kouta.component';

describe('ShareKoutaComponent', () => {
  let component: ShareKoutaComponent;
  let fixture: ComponentFixture<ShareKoutaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareKoutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareKoutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
