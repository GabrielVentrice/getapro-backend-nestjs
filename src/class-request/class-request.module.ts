import { Module } from '@nestjs/common';
import { ClassRequestController } from './controller/class-request.controller';
import { ClassRequestService } from './service/class-request.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ClassRequestController],
  providers: [ClassRequestService],
  imports: [PrismaModule],
  exports: [ClassRequestService],
})
export class ClassRequestModule {}
