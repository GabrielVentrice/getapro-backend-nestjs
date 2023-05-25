import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthAdminService } from '../../service/admin/auth-admin.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
  Strategy,
  'local-admin',
) {
  constructor(private authAdminService: AuthAdminService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const validatedUser = await this.authAdminService.validateAdmin({
      email,
      password,
    });

    if (!validatedUser) throw new ForbiddenException('Access Denied');

    return validatedUser;
  }
}
