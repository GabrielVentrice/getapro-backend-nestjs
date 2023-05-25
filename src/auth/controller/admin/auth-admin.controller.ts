import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthAdminService } from '../../service/admin/auth-admin.service';
import { LocalAdminAuthGuard, AccessTokenAuthGuard } from '../../guard';
import type { Tokens } from '../../types/tokens.type';

@Controller('auth/admin')
export class AuthAdminController {
  constructor(private authService: AuthAdminService) {}

  @UseGuards(LocalAdminAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req): Promise<Tokens> {
    return this.authService.signinAdmin(req.user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  async logout(@Request() req): Promise<boolean> {
    const { sub: userId } = req.user;

    return await this.authService.logout(userId);
  }
}
