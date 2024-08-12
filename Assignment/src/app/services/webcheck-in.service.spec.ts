import { TestBed } from '@angular/core/testing';

import { WebcheckInService } from './webcheck-in.service';

describe('WebcheckInService', () => {
  let service: WebcheckInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebcheckInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
