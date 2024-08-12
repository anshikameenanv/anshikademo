import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterFlightPageComponent } from './filter-flight-page.component';

describe('FilterFlightPageComponent', () => {
  let component: FilterFlightPageComponent;
  let fixture: ComponentFixture<FilterFlightPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterFlightPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterFlightPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
