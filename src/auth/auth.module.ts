import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StudentModule } from 'src/student/student.module';
import { AuthController } from './controller/auth.controller';
import { AuthStudentService } from './service/auth-student.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  LocalStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './strategy';

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
