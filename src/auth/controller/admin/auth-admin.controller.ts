import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Body,
  ForbiddenException,
  ParseIntPipe,
  Query,
  Param,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthAdminService } from '../../service/admin/auth-admin.service';
import { LocalAdminAuthGuard, AccessTokenAuthGuard } from '../../guard';
import { AuthDto } from '../../../auth/_dto/auth.user.dto';
import { AuthResponse } from '../../../auth/types/response.type';
import type { Tokens } from '../../types/tokens.type';
import { ForgotPasswordDto } from 'src/auth/_dto/forgot-password.dto';
import { RecoverPasswordDto } from 'src/auth/_dto/recover-password.dto';
@Controller('auth/admin')
@ApiTags('Authentication/Admin')
export class AuthAdminController {
  constructor(private authService: AuthAdminService) {}

  @UseGuards(LocalAdminAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login admin user' })
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({
    type: AuthResponse,
    description: 'Access token and refresh token to be used in future requests',
  })
  async login(@Request() req): Promise<Tokens> {
    return this.authService.signinAdmin(req.user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout admin user' })
  @ApiCreatedResponse({
    description: 'User logged out successfully',
  })
  async logout(@Request() req): Promise<boolean> {
    const { sub: userId } = req.user;

    return await this.authService.logout(userId);
  }

  @Post('password/forgot')
  async forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<void> {
    const user = await this.authService.validateAdminEmail(email);

    if (!user) throw new ForbiddenException('User not found');

    const oneTimeRecoveryToken = await this.authService.generateRecoveryToken(
      user,
    );

    // TODO: study how to return the correct domain
    const link = `https://localhost:5432/auth/admin/${user.id}/password/recover?token=${oneTimeRecoveryToken}`;

    // TODO: send email via SMTP or another service
    console.log({ link });
  }

  // TODO: Revogate other JWTs in use after password recovery
  @Post(':id/password/recover')
  async recoverPassword(
    @Body() { password, passwordConfirmation }: RecoverPasswordDto,
    @Param('id', ParseIntPipe) adminId: number,
    @Query('token') token: string,
  ): Promise<void> {
    if (password !== passwordConfirmation) {
      throw new BadRequestException(
        'The two passwords provided must be the same',
      );
    }

    const user = await this.authService.validateAdminId(adminId);

    if (!user) throw new ForbiddenException('User not found');

    try {
      const payload = await this.authService.validateRecoveryToken(user, token);

      if (user.id !== payload.sub) {
        throw new ForbiddenException('User does not match token');
      }

      const updatedUser = await this.authService.recoverPassword(
        adminId,
        password,
      );

      console.log({ updatedUser });
    } catch {
      throw new ForbiddenException('Could not validate token');
    }
  }
}
