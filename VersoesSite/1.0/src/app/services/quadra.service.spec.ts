import { TestBed } from '@angular/core/testing';

import { QuadraService } from './quadra.service';

describe('QuadraService', () => {
  let service: QuadraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuadraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
