import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { ConfigModule } from '@nestjs/config';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { ClassRequestModule } from './class-request/class-request.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StudentModule,
    TeacherModule,
    ClassModule,
    ClassRequestModule,
    GameModule,
  ],
  exports: [ConfigModule],
  providers: [],
})
export class AppModule {}
