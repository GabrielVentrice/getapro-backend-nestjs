import { Module } from '@nestjs/common';
import { ClassController } from './controller/class.controller';
import { ClassService } from './service/class.service';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
