import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxsAndFeesComponent } from './taxs-and-fees.component';

describe('TaxsAndFeesComponent', () => {
  let component: TaxsAndFeesComponent;
  let fixture: ComponentFixture<TaxsAndFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxsAndFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxsAndFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
