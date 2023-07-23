import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { NecordModule } from 'necord';
import { NecordConfigService } from './necord.config.service';
import { DiscordController } from './discord.controller';

@Module({
  imports: [
    NecordModule.forRootAsync({
      useClass: NecordConfigService,
    }),
  ],
  controllers: [DiscordController],
  providers: [NecordConfigService, DiscordService],
})
export class DiscordModule {}
