import { ForbiddenException, Injectable } from '@nestjs/common';
import { StudentService } from 'src/student/service/student.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Tokens } from '../types/tokens.type';
import { AuthDto } from '../_dto/auth.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private studentService: StudentService,
    private jwtService: JwtService,
  ) {}

  async signinLocalStudent(dto: AuthDto): Promise<Tokens> {
    const user = await this.studentService.findOne(dto.email);

    if (!user) throw new ForbiddenException('Access Denied');

    console.log('SIGNLOCAL_STUDENT__USER:', user);

    const passwordMatches = await argon.verify(user.hash, dto.password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon.hash(rt);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }
}
