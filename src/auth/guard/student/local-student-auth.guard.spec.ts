import { LocalStudentAuthGuard } from './local-student-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be defined', () => {
    expect(new LocalStudentAuthGuard()).toBeDefined();
  });
});
