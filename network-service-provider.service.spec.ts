import { TestBed } from '@angular/core/testing';

import { NetworkServiceProviderService } from './network-service-provider.service';

describe('NetworkServiceProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkServiceProviderService = TestBed.get(NetworkServiceProviderService);
    expect(service).toBeTruthy();
  });
});
