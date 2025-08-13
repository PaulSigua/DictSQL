import { TestBed } from '@angular/core/testing';

import { UiBusService } from './ui-bus.service';

describe('UiBusService', () => {
  let service: UiBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
