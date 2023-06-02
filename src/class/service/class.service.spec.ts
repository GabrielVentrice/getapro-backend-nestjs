import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ClassService } from './class.service';
import { PrismaModule } from '../../prisma/prisma.module';

describe('ClassService', () => {
  let service: ClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassService],
      imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    service = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
