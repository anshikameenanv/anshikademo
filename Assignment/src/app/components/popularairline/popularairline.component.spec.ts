import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularairlineComponent } from './popularairline.component';

describe('PopularairlineComponent', () => {
  let component: PopularairlineComponent;
  let fixture: ComponentFixture<PopularairlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopularairlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularairlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
