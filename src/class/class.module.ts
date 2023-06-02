import { Module } from '@nestjs/common';
import { ClassController } from './controller/class.controller';
import { ClassService } from './service/class.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  imports: [PrismaModule],
  exports: [ClassService],
})
export class ClassModule {}
