import { ApiResponseProperty } from '@nestjs/swagger';

export class DefaultTeacherResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  discordId?: string;
}
