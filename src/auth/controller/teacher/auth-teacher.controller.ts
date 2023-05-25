import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthTeacherService } from '../../service/teacher/auth-teacher.service';
import { LocalTeacherAuthGuard, AccessTokenAuthGuard } from '../../guard';
import type { Tokens } from '../../types/tokens.type';

@Controller('auth/teacher')
export class AuthTeacherController {
  constructor(private authService: AuthTeacherService) {}

  @UseGuards(LocalTeacherAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req): Promise<Tokens> {
    return this.authService.signinTeacher(req.user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  async logout(@Request() req): Promise<boolean> {
    const { sub: userId } = req.user;

    return await this.authService.logout(userId);
  }
}
