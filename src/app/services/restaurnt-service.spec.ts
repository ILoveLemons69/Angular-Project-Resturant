import { TestBed } from '@angular/core/testing';

import { RestaurntService } from './restaurnt-service';

describe('RestaurntService', () => {
  let service: RestaurntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
