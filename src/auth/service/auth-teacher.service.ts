import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { Tokens } from '../types/tokens.type';
import { AuthDto } from '../_dto/auth.user.dto';
import { JwtPayload } from '../types/jwtPayload.type';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherDto } from '../../teacher/_dto/create.teacher.dto';
import { TeacherService } from '../../teacher/service/teacher.service';

@Injectable()
export class AuthTeacherService {
  constructor(
    private teacherService: TeacherService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private config: ConfigService,
  ) {}

  async signinLocalTeacher({ email, password }: AuthDto): Promise<Tokens> {
    const user = await this.prismaService.teacher.findFirst({
      where: { email },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(user.hash, password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async singup(dto: CreateTeacherDto): Promise<Tokens> {
    const newUser = await this.teacherService.create(dto);

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);

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
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }
}
