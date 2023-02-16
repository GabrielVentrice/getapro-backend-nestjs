import { Module } from '@nestjs/common';
import { AuthService } from './service/auth-student.service';
import { AuthController } from './controller/auth.controller';
import { StudentModule } from 'src/student/student.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [StudentModule, PassportModule, JwtModule.register({})],
  providers: [
    AuthService,
    LocalStrategy,
    PrismaService,
    JwtService,
    ConfigService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
