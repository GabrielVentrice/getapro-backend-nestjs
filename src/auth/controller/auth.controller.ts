import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Tokens } from '../types/tokens.type';
import { AuthDto } from '../_dto/auth.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('student')
  async loginStudent(@Body() dto: AuthDto): Promise<Tokens> {
    return await this.authService.signinLocalStudent(dto);
  }
}
