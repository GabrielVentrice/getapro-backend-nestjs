import { Controller, Get, Post } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get('guilds')
  listGuilds() {
    return this.discordService.listGuilds();
  }

  @Post('channel')
  createChannel() {
    return this.discordService.createClassChannel(new Date().toISOString());
  }
}
