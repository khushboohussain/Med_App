import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployersPage } from './employers.page';

describe('EmployersPage', () => {
  let component: EmployersPage;
  let fixture: ComponentFixture<EmployersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
