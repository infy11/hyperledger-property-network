import { TestBed, inject } from '@angular/core/testing';

import { AdvocateService } from './advocate.service';

describe('AdvocateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdvocateService]
    });
  });

  it('should be created', inject([AdvocateService], (service: AdvocateService) => {
    expect(service).toBeTruthy();
  }));
});
