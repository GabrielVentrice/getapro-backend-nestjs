import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TeacherService } from './teacher.service';
import { PrismaModule } from '../../prisma/prisma.module';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherService],
      imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
