import { Injectable } from '@nestjs/common';
import { ChannelType, Client } from 'discord.js';

@Injectable()
export class DiscordService {
  constructor(private readonly discordClient: Client) {}

  async listGuilds() {
    const cachedGuilds = this.discordClient.guilds.cache;

    return cachedGuilds;
  }

  private async getGuild() {
    const guildId = '1117961951725752425';
    const cachedGuild = this.discordClient.guilds.cache.get(guildId);

    if (!cachedGuild) return this.discordClient.guilds.fetch(guildId);

    return cachedGuild;
  }

  async createClassChannel(className: string) {
    const guild = await this.getGuild();
    const everyoneRole = guild.roles.cache.find(
      (role) => role.name === '@everyone',
    );

    const category = await guild.channels.create({
      name: className,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: everyoneRole.id,
          deny: 'ViewChannel',
        },
        {
          id: '289853707724652544', // TODO: Receive student discord ID and teachet discord ID to allow ViewChannel permission
          allow: 'ViewChannel',
        },
      ],
    });

    const textChannelPromise = category.children.create({
      name: 'Mensagens - Aula',
      type: ChannelType.GuildText,
    });

    const voiceChannelPromise = category.children.create({
      name: 'Chamada - Aula',
      type: ChannelType.GuildVoice,
    });

    const [textChannel, voiceChannel] = await Promise.all([
      textChannelPromise,
      voiceChannelPromise,
    ]);

    return {
      categoryChannel: category,
      textChannel,
      voiceChannel,
    };
  }
}
