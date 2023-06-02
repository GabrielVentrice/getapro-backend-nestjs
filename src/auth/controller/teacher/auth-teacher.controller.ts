import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthTeacherService } from '../../service/teacher/auth-teacher.service';
import { LocalTeacherAuthGuard, AccessTokenAuthGuard } from '../../guard';
import { AuthDto } from '../../../auth/_dto/auth.user.dto';
import { AuthResponse } from '../../../auth/types/response.type';
import type { Tokens } from '../../types/tokens.type';

@Controller('auth/teacher')
@ApiTags('Authentication/Teacher')
export class AuthTeacherController {
  constructor(private authService: AuthTeacherService) {}

  @UseGuards(LocalTeacherAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login teacher user' })
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({
    type: AuthResponse,
    description: 'Access token and refresh token to be used in future requests',
  })
  async login(@Request() req): Promise<Tokens> {
    return this.authService.signinTeacher(req.user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout student user' })
  @ApiCreatedResponse({
    description: 'User logged out successfully',
  })
  async logout(@Request() req): Promise<boolean> {
    const { sub: userId } = req.user;

    return await this.authService.logout(userId);
  }
}
