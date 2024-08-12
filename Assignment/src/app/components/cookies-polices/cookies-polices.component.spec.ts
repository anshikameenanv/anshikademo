import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesPolicesComponent } from './cookies-polices.component';

describe('CookiesPolicesComponent', () => {
  let component: CookiesPolicesComponent;
  let fixture: ComponentFixture<CookiesPolicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookiesPolicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiesPolicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
