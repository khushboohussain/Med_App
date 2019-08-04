import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationsPage } from './qualifications.page';

describe('QualificationsPage', () => {
  let component: QualificationsPage;
  let fixture: ComponentFixture<QualificationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualificationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
