import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ClassController } from './class.controller';
import { ClassService } from '../service/class.service';
import { PrismaModule } from '../../prisma/prisma.module';

describe('ClassController', () => {
  let controller: ClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassController],
      providers: [ClassService],
      imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    controller = module.get<ClassController>(ClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
