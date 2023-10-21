import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Admin } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from '../../../prisma/prisma.service';
import { AT_SECRET_KEY, RT_SECRET_KEY } from '../../constants';
import type { AuthDto } from '../../_dto/auth.user.dto';
import type { JwtPayload } from '../../types/jwtPayload.type';
import type { Tokens } from '../../types/tokens.type';

@Injectable()
export class AuthAdminService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private config: ConfigService,
  ) {}

  async validateAdmin({ email, password }: AuthDto): Promise<Admin> {
    const user = await this.prismaService.admin.findFirst({
      where: { email },
    });
    if (!user) return;

    const passwordMatches = await argon.verify(user.hash, password);
    if (!passwordMatches) return;

    return user;
  }

  async validateAdminEmail(email: string): Promise<Admin> {
    const user = await this.prismaService.admin.findFirst({
      where: { email },
    });

    if (!user) return;

    return user;
  }

  async validateAdminId(id: number): Promise<Admin> {
    const user = await this.prismaService.admin.findFirst({
      where: { id },
    });

    if (!user) return;

    return user;
  }

  async signinAdmin(admin: Admin): Promise<Tokens> {
    const tokens = await this.getTokens(admin.id, admin.email);
    await this.updateRtHash(admin.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.prismaService.admin.updateMany({
      where: {
        id: userId,
        hashRt: {
          not: null,
        },
      },
      data: {
        hashRt: null,
      },
    });

    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prismaService.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon.hash(rt);

    await this.prismaService.admin.update({
      where: {
        id: userId,
      },
      data: {
        hashRt: hash,
      },
    });
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>(AT_SECRET_KEY),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>(RT_SECRET_KEY),
        expiresIn: '7d',
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  generateRecoveryToken(admin: Admin): string {
    // TODO: study the possibility to change jwtSecret by a newly generated
    // hash and store it in the user model for greater security
    const jwtSecret = this.config.get<string>(AT_SECRET_KEY);
    const adminSecret = jwtSecret + admin.hash;

    const payload = {
      sub: admin.id,
      email: admin.email,
    };

    const recoveryToken = this.jwtService.sign(payload, {
      secret: adminSecret,
      expiresIn: '15m',
    });

    return recoveryToken;
  }

  validateRecoveryToken(
    admin: Admin,
    token: string,
  ): { sub: number; email: string } {
    const jwtSecret = this.config.get<string>(AT_SECRET_KEY);
    const adminSecret = jwtSecret + admin.hash;

    const payload = this.jwtService.verify<{ sub: number; email: string }>(
      token,
      {
        secret: adminSecret,
      },
    );

    return payload;
  }

  async recoverPassword(
    adminId: number,
    password: string,
  ): Promise<Pick<Admin, 'id' | 'email' | 'name'>> {
    const hash = await argon.hash(password);

    const updatedadmin = await this.prismaService.admin.update({
      where: { id: adminId },
      data: {
        hash,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return updatedadmin;
  }
}
