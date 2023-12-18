import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealrshipComponent } from './dealrship.component';

describe('DealrshipComponent', () => {
  let component: DealrshipComponent;
  let fixture: ComponentFixture<DealrshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealrshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealrshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
