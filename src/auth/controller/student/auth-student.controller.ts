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
import { AuthStudentService } from '../../service/student/auth-student.service';
import { LocalStudentAuthGuard, AccessTokenAuthGuard } from '../../guard';
import type { Tokens } from '../../types/tokens.type';
import { AuthDto } from '../../../auth/_dto/auth.user.dto';
import { AuthResponse } from '../../../auth/types/response.type';

@Controller('auth/student')
@ApiTags('Authentication/Student')
export class AuthStudentController {
  constructor(private authService: AuthStudentService) {}

  @UseGuards(LocalStudentAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login student user' })
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({
    type: AuthResponse,
    description: 'Access token and refresh token to be used in future requests',
  })
  async login(@Request() req): Promise<Tokens> {
    return this.authService.signinStudent(req.user);
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
