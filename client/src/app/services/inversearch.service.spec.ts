import { TestBed, inject } from '@angular/core/testing';

import { InversearchService } from './inversearch.service';

describe('InversearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InversearchService]
    });
  });

  it('should be created', inject([InversearchService], (service: InversearchService) => {
    expect(service).toBeTruthy();
  }));
});
