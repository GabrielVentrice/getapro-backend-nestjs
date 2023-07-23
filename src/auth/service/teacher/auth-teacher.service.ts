import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Teacher } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from '../../../prisma/prisma.service';
import { AT_SECRET_KEY, RT_SECRET_KEY } from '../../constants';
import type { CreateTeacherDto } from '../../../teacher/_dto/create.teacher.dto';
import type { AuthDto } from '../../_dto/auth.user.dto';
import type { JwtPayload } from '../../types/jwtPayload.type';
import type { TokensWithExpirationTime, Tokens } from '../../types/tokens.type';
import { TeacherService } from '../../../teacher/service/teacher.service';

@Injectable()
export class AuthTeacherService {
  constructor(
    private teacherService: TeacherService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private config: ConfigService,
  ) {}

  async validateTeacher({ email, password }: AuthDto): Promise<Teacher> {
    const user = await this.prismaService.teacher.findFirst({
      where: { email },
    });
    if (!user) return;

    const passwordMatches = await argon.verify(user.hash, password);
    if (!passwordMatches) return;

    return user;
  }

  async signinTeacher(teacher: Teacher): Promise<TokensWithExpirationTime> {
    const { access_token, refresh_token } = await this.getTokens(
      teacher.id,
      teacher.email,
    );
    await this.updateRtHash(teacher.id, refresh_token);

    const { exp: atExp } = this.jwtService.decode(access_token) as Record<
      string,
      any
    >;
    const { exp: rtExp } = this.jwtService.decode(refresh_token) as Record<
      string,
      any
    >;

    return {
      access_token,
      access_token_expiration: atExp * 1000,
      refresh_token,
      refresh_token_expiration: rtExp * 1000,
    };
  }

  async singup(dto: CreateTeacherDto): Promise<Tokens> {
    const teacher = await this.teacherService.create(dto);
    const tokens = await this.signinTeacher(teacher);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.prismaService.teacher.updateMany({
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
    const user = await this.prismaService.teacher.findUnique({
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

    await this.prismaService.teacher.update({
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
}
