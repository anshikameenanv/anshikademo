import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDealerDialogComponent } from './add-dealer-dialog.component';

describe('AddDealerDialogComponent', () => {
  let component: AddDealerDialogComponent;
  let fixture: ComponentFixture<AddDealerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDealerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDealerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
