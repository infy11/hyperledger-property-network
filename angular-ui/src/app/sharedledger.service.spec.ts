import { TestBed, inject } from '@angular/core/testing';

import { SharedledgerService } from './sharedledger.service';

describe('SharedledgerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedledgerService]
    });
  });

  it('should be created', inject([SharedledgerService], (service: SharedledgerService) => {
    expect(service).toBeTruthy();
  }));
});
