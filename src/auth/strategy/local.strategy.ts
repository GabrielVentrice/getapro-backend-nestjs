import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthStudentService } from '../service/auth-student.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authStudentService: AuthStudentService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const validatedUser = await this.authService.validateStudent({
      email,
      password,
    });

    if (!validatedUser) throw new ForbiddenException('Access Denied');

    return validatedUser;
  }
}
