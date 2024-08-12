import { TestBed } from '@angular/core/testing';

import { FilterrouteService } from './filterroute.service';

describe('FilterrouteService', () => {
  let service: FilterrouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterrouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
