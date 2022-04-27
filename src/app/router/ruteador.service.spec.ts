import { TestBed } from '@angular/core/testing';

import { RuteadorService } from './ruteador.service';

describe('RuteadorService', () => {
  let service: RuteadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuteadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
