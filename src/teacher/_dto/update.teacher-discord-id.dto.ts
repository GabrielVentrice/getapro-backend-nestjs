import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTeacherDiscordIdDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  discordId: string;
}
