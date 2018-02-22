import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTriComponent } from './contact-tri.component';

describe('ContactTriComponent', () => {
  let component: ContactTriComponent;
  let fixture: ComponentFixture<ContactTriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactTriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactTriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
