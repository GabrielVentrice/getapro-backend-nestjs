import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthStudentService } from '../service/auth-student.service';
import { LocalStudentAuthGuard, AccessTokenAuthGuard } from '../guard';
import type { Tokens } from '../types/tokens.type';

@Controller('auth/student')
export class AuthStudentController {
  constructor(private authService: AuthStudentService) {}

  @UseGuards(LocalStudentAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req): Promise<Tokens> {
    return this.authService.signinStudent(req.user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  async logout(@Request() req): Promise<boolean> {
    const { sub: userId } = req.user;

    return await this.authService.logout(userId);
  }
}
