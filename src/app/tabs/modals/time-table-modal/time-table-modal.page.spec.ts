import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTableModalPage } from './time-table-modal.page';

describe('TimeTableModalPage', () => {
  let component: TimeTableModalPage;
  let fixture: ComponentFixture<TimeTableModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeTableModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTableModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
