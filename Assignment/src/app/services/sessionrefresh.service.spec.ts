import { TestBed } from '@angular/core/testing';

import { SessionrefreshService } from './sessionrefresh.service';

describe('SessionrefreshService', () => {
  let service: SessionrefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionrefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
