import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TeacherController } from './teacher.controller';
import { TeacherService } from '../service/teacher.service';
import { PrismaModule } from '../../prisma/prisma.module';

describe('TeacherController', () => {
  let controller: TeacherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [TeacherService],
      imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
