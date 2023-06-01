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
import { AuthAdminService } from '../../service/admin/auth-admin.service';
import { LocalAdminAuthGuard, AccessTokenAuthGuard } from '../../guard';
import { AuthDto } from 'src/auth/_dto/auth.user.dto';
import { AuthResponse } from 'src/auth/types/response.type';
import type { Tokens } from '../../types/tokens.type';
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
}
