import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthStudentService } from '../service/auth-student.service';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authStudentService: AuthStudentService) {
    super();
  }

  async validadeStudent(username: string, password: string): Promise<any> {}
}
