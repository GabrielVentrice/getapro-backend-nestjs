import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StudentController } from './controller/student.controller';
import { StudentService } from './service/student.service';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [PrismaModule],
  exports: [StudentService],
})
export class StudentModule {}
