import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GetCurrentUserId, Public } from '../../common/decorators';
import { AuthService } from '../service/auth-student.service';
import { Tokens } from '../types/tokens.type';
import { AuthDto } from '../_dto/auth.user.dto';

@Controller('auth/student')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto): Promise<Tokens> {
    return await this.authService.signinLocalStudent(dto);
  }

  @Post('logout')
  async logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return await this.authService.logout(userId);
  }
}
