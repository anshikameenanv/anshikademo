import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFlightComponent } from './review-flight.component';

describe('ReviewFlightComponent', () => {
  let component: ReviewFlightComponent;
  let fixture: ComponentFixture<ReviewFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewFlightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
