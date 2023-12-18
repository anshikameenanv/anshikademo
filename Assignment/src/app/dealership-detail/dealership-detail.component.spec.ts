import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealershipDetailComponent } from './dealership-detail.component';

describe('DealershipDetailComponent', () => {
  let component: DealershipDetailComponent;
  let fixture: ComponentFixture<DealershipDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealershipDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealershipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
