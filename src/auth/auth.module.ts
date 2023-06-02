import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StudentModule } from '../student/student.module';
import { TeacherModule } from '../teacher/teacher.module';
import { PrismaService } from '../prisma/prisma.service';
import { AuthAdminController } from './controller/admin/auth-admin.controller';
import { AuthStudentController } from './controller/student/auth-student.controller';
import { AuthTeacherController } from './controller/teacher/auth-teacher.controller';
import { AuthAdminService } from './service/admin/auth-admin.service';
import { AuthStudentService } from './service/student/auth-student.service';
import { AuthTeacherService } from './service/teacher/auth-teacher.service';
import {
  LocalAdminStrategy,
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
    AuthAdminService,
    AuthStudentService,
    AuthTeacherService,
    LocalAdminStrategy,
    LocalStudentStrategy,
    LocalTeacherStrategy,
    PrismaService,
    JwtService,
    ConfigService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [
    AuthAdminController,
    AuthStudentController,
    AuthTeacherController,
  ],
})
export class AuthModule {}
