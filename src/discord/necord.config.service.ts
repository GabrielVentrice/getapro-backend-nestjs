import { Injectable } from '@nestjs/common';
import { NecordModuleOptions } from 'necord';
import { IntentsBitField } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NecordConfigService {
  constructor(private readonly config: ConfigService) {}

  createNecordOptions(): NecordModuleOptions {
    return {
      token: this.config.get<string>('DISCORD_BOT_TOKEN'),
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
      ],
    };
  }
}
