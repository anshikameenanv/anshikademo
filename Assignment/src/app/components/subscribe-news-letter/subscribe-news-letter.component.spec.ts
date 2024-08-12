import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeNewsLetterComponent } from './subscribe-news-letter.component';

describe('SubscribeNewsLetterComponent', () => {
  let component: SubscribeNewsLetterComponent;
  let fixture: ComponentFixture<SubscribeNewsLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeNewsLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribeNewsLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
