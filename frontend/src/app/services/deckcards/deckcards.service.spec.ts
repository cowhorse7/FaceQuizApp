import { TestBed } from '@angular/core/testing';

import { DeckcardsService } from './deckcards.service';

describe('DeckcardsService', () => {
  let service: DeckcardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckcardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
