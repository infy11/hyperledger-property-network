import { TestBed, inject } from '@angular/core/testing';

import { BankService } from './bank.service';

describe('BankService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BankService]
    });
  });

  it('should be created', inject([BankService], (service: BankService) => {
    expect(service).toBeTruthy();
  }));
});
