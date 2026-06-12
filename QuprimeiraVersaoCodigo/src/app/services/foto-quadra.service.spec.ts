import { TestBed } from '@angular/core/testing';

import { FotoQuadraService } from './foto-quadra.service';

describe('FotoQuadraService', () => {
  let service: FotoQuadraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FotoQuadraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
