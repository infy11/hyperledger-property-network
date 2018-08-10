import { TestBed, inject } from '@angular/core/testing';

import { GdaService } from './gda.service';

describe('GdaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GdaService]
    });
  });

  it('should be created', inject([GdaService], (service: GdaService) => {
    expect(service).toBeTruthy();
  }));
});
