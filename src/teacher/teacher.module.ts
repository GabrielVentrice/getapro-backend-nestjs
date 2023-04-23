import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TeacherController } from './controller/teacher.controller';
import { TeacherService } from './service/teacher.service';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService],
  imports: [PrismaModule],
  exports: [TeacherService],
})
export class TeacherModule {}
