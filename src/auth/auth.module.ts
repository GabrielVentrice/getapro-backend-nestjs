import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StudentModule } from 'src/student/student.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { AuthStudentController } from './controller/auth-student.controller';
import { AuthTeacherController } from './controller/auth-teacher.controller';
import { AuthStudentService } from './service/auth-student.service';
import { AuthTeacherService } from './service/auth-teacher.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  LocalStudentStrategy,
  LocalTeacherStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './strategy';

@Module({
  imports: [
    StudentModule,
    TeacherModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthStudentService,
    AuthTeacherService,
    LocalStudentStrategy,
    LocalTeacherStrategy,
    PrismaService,
    JwtService,
    ConfigService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthStudentController, AuthTeacherController],
})
export class AuthModule {}
