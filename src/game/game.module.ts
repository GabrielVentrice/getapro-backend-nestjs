import { Module } from '@nestjs/common';
import { GameController } from './controller/game.controller';
import { GameService } from './service/game.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [PrismaModule],
  exports: [GameService],
})
export class GameModule {}
