import { AccessTokenAuthGuard } from './at-auth.guard';

describe('AccessTokenAuthGuard', () => {
  it('should be defined', () => {
    expect(new AccessTokenAuthGuard()).toBeDefined();
  });
});
