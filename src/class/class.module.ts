import { Module } from '@nestjs/common';
import { ClassController } from './controller/class.controller';
import { ClassService } from './service/class.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DiscordService } from 'src/discord/discord.service';

@Module({
  controllers: [ClassController],
  providers: [ClassService, DiscordService],
  imports: [PrismaModule],
  exports: [ClassService],
})
export class ClassModule {}
