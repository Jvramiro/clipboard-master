import { TestBed } from '@angular/core/testing';

describe('Clipboard', () => {
  let service: Clipboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Clipboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
