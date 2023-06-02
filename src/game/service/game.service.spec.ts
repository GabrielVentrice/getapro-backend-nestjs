import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { GameService } from './game.service';
import { PrismaModule } from '../../prisma/prisma.module';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
      imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
