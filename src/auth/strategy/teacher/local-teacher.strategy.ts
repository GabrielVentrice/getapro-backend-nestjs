import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthTeacherService } from '../../service/teacher/auth-teacher.service';

@Injectable()
export class LocalTeacherStrategy extends PassportStrategy(
  Strategy,
  'local-teacher',
) {
  constructor(private authTeacherService: AuthTeacherService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const validatedUser = await this.authTeacherService.validateTeacher({
      email,
      password,
    });

    if (!validatedUser) throw new ForbiddenException('Access Denied');

    return validatedUser;
  }
}
