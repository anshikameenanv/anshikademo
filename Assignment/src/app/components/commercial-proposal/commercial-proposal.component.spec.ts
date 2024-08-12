import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialProposalComponent } from './commercial-proposal.component';

describe('CommercialProposalComponent', () => {
  let component: CommercialProposalComponent;
  let fixture: ComponentFixture<CommercialProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
