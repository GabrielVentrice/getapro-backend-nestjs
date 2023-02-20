import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { ConfigModule } from '@nestjs/config';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StudentModule,
    TeacherModule,
  ],
  exports: [ConfigModule],
})
export class AppModule {}
