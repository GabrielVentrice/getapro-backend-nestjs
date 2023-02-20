import { Module } from '@nestjs/common';
import { AuthStudentService } from './service/auth-student.service';
import { AuthController } from './controller/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { ConfigService } from '@nestjs/config';
import { StudentModule } from '../student/student.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [StudentModule, PassportModule, JwtModule.register({})],
  providers: [
    AuthStudentService,
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
