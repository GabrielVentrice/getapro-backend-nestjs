import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Body,
  BadRequestException,
  Param,
  ParseIntPipe,
  Query,
  ForbiddenException,
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
import { ForgotPasswordDto } from 'src/auth/_dto/forgot-password.dto';
import { RecoverPasswordDto } from 'src/auth/_dto/recover-password.dto';

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

  @Post('password/forgot')
  async forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<void> {
    const user = await this.authService.validateStudentEmail(email);

    if (!user) throw new ForbiddenException('User not found');

    const oneTimeRecoveryToken = await this.authService.generateRecoveryToken(
      user,
    );

    // TODO: study how to return the correct domain
    const link = `https://localhost:5432/auth/student/${user.id}/password/recover?token=${oneTimeRecoveryToken}`;

    // TODO: send email via SMTP or another service
    console.log({ link });
  }

  // TODO: Revogate other JWTs in use after password recovery
  @Post(':id/password/recover')
  async recoverPassword(
    @Body() { password, passwordConfirmation }: RecoverPasswordDto,
    @Param('id', ParseIntPipe) studentId: number,
    @Query('token') token: string,
  ): Promise<void> {
    if (password !== passwordConfirmation) {
      throw new BadRequestException(
        'The two passwords provided must be the same',
      );
    }

    const user = await this.authService.validateStudentId(studentId);

    if (!user) throw new ForbiddenException('User not found');

    try {
      const payload = await this.authService.validateRecoveryToken(user, token);

      if (user.id !== payload.sub) {
        throw new ForbiddenException('User does not match token');
      }

      const updatedUser = await this.authService.recoverPassword(
        studentId,
        password,
      );

      console.log({ updatedUser });
    } catch {
      throw new ForbiddenException('Could not validate token');
    }
  }
}
