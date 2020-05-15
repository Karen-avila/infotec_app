import { TestBed } from '@angular/core/testing';

import { BancosService } from './bancos.service';

describe('BancosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BancosService = TestBed.get(BancosService);
    expect(service).toBeTruthy();
  });
});
