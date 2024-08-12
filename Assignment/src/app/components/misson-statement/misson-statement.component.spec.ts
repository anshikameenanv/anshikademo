import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissonStatementComponent } from './misson-statement.component';

describe('MissonStatementComponent', () => {
  let component: MissonStatementComponent;
  let fixture: ComponentFixture<MissonStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissonStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissonStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
