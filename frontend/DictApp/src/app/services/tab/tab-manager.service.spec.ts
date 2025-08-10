import { TestBed } from '@angular/core/testing';

import { TabManagerService } from './tab-manager.service';

describe('TabManagerService', () => {
  let service: TabManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
