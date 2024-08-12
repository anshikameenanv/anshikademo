import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvesterRelationComponent } from './invester-relation.component';

describe('InvesterRelationComponent', () => {
  let component: InvesterRelationComponent;
  let fixture: ComponentFixture<InvesterRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvesterRelationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvesterRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
